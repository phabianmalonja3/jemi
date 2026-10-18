"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  X,
  Phone,
  Mail,
  Loader2,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Clock,
  Bug,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Plan {
  id: string | number;
  name: string;
  price: number;
}

interface PaymentPartner {
  id: string;
  code: string;
  name: string;
  logo?: string;
  provider: string | number;
  paymentPartnerId?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
  onSuccessfulPayment: (message: string) => void;
  onPaymentCompleted?: (paymentData: any) => void;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.jemigraph.co.tz/api/v0.1"
).replace(/\/+$/, "");

const PARTNERS_ENDPOINT = `${API_URL}/payments/partners`;
const INITIATION_ENDPOINT = `${API_URL}/payments/website/pay`;
const PAYMENT_STATUS_ENDPOINT = `${API_URL}/payments/status`;

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

function getPartnerName(value: string): string {
  const normalized = value.toUpperCase().replace(/[\s_-]/g, "");

  if (normalized.includes("AIRTEL")) return "Airtel Money";

  if (
    normalized.includes("TIGO") ||
    normalized.includes("MIXX") ||
    normalized.includes("YAS")
  ) {
    return "Mixx by Yas (Tigo Pesa)";
  }

  if (normalized.includes("HALO")) return "HaloPesa";
  if (normalized.includes("AZAM")) return "AzamPesa";

  return value;
}

function getPartnerLogo(value: string): string {
  const normalized = value.toUpperCase().replace(/[\s_-]/g, "");

  if (normalized.includes("AIRTEL")) {
    return "/payment-logos/airtel-money.png";
  }

  if (
    normalized.includes("TIGO") ||
    normalized.includes("MIXX") ||
    normalized.includes("YAS")
  ) {
    return "/payment-logos/mixx-yas.png";
  }

  if (normalized.includes("HALO")) {
    return "/payment-logos/halopesa.png";
  }

  if (normalized.includes("AZAM")) {
    return "/payment-logos/azampesa.png";
  }

  return "";
}

function normalizePartners(responseData: any): PaymentPartner[] {
  const data = Array.isArray(responseData)
    ? responseData
    : responseData?.data ??
      responseData?.partners ??
      responseData?.providers ??
      responseData?.paymentPartners ??
      responseData?.content ??
      [];

  if (!Array.isArray(data)) return [];

  return data
    .filter((item: any) => {
      if (!item) return false;

      if (item.enabled === false || item.active === false) {
        return false;
      }

      const status = item.status;

      if (
        status !== undefined &&
        ![
          "1",
          1,
          true,
          "ACTIVE",
          "active",
          "ENABLED",
          "enabled",
        ].includes(status)
      ) {
        return false;
      }

      return true;
    })
    .map((item: any): PaymentPartner => {
      const rawName = String(
        item.partnerName ??
          item.displayName ??
          item.name ??
          item.label ??
          ""
      );

      const provider =
        item.provider ??
        item.providerCode ??
        item.code ??
        rawName;

      return {
        id: String(
          item.id ?? item.paymentPartnerId ?? provider
        ),
        code: String(provider),
        provider,
        name: getPartnerName(rawName),
        logo:
          item.logoUrl ??
          item.logoURL ??
          item.logo ??
          item.imageUrl ??
          getPartnerLogo(rawName),
        paymentPartnerId: item.paymentPartnerId
          ? String(item.paymentPartnerId)
          : undefined,
      };
    })
    .filter((partner) => partner.code && partner.name)
    .filter(
      (partner, index, list) =>
        list.findIndex((item) => item.id === partner.id) === index
    );
}

function normalizePhoneNumber(value: string): string | null {
  const phone = value.replace(/[\s()-]/g, "");

  if (!/^(?:\+?255|0)?[67]\d{8}$/.test(phone)) {
    return null;
  }

  if (phone.startsWith("+")) return phone.slice(1);

  if (phone.startsWith("0")) {
    return `255${phone.slice(1)}`;
  }

  if (phone.startsWith("255")) return phone;

  return `255${phone}`;
}

function getErrorMessage(err: any): string {
  const data = err?.response?.data;

  if (data) {
    if (typeof data === "string") return data;

    if (Array.isArray(data.errors)) {
      return data.errors
        .map((item: any) =>
          typeof item === "string"
            ? item
            : `${item.field ? `${item.field}: ` : ""}${
                item.defaultMessage ??
                item.message ??
                JSON.stringify(item)
              }`
        )
        .join("; ");
    }

    if (
      data.errors &&
      typeof data.errors === "object" &&
      !Array.isArray(data.errors)
    ) {
      return Object.entries(data.errors)
        .map(([field, message]) => `${field}: ${String(message)}`)
        .join("; ");
    }

    return (
      data.message ??
      data.error_description ??
      data.detail ??
      data.error ??
      `Backend returned HTTP ${err.response.status}`
    );
  }

  if (err?.code === "ECONNABORTED") {
    return "Request timed out. Please check the backend logs.";
  }

  if (!err?.response && err?.request) {
    return "Cannot reach the backend. Check the API URL, server and network.";
  }

  return err?.message || "An unexpected error occurred.";
}

function getBackendErrorDetails(err: any): string {
  if (err?.response) {
    return JSON.stringify(
      {
        httpStatus: err.response.status,
        statusText: err.response.statusText,
        url: err.config?.url,
        method: err.config?.method?.toUpperCase(),
        response: err.response.data,
      },
      null,
      2
    );
  }

  return JSON.stringify(
    {
      message: err?.message,
      code: err?.code,
      url: err?.config?.url,
      method: err?.config?.method?.toUpperCase(),
      networkError: !err?.response,
    },
    null,
    2
  );
}

function getPaymentStatus(data: any): string {
  return String(
    data?.status ??
      data?.paymentStatus ??
      data?.transactionStatus ??
      ""
  )
    .trim()
    .toUpperCase();
}

function getTransactionId(data: any): string | null {
  const value =
    data?.transactionId ??
    data?.data?.transactionId ??
    data?.transaction?.transactionId;

  return value == null || String(value).trim() === ""
    ? null
    : String(value);
}

function isPaymentSuccessful(status: string): boolean {
  return [
    "SUCCESS",
    "SUCCESSFUL",
    "PAID",
    "COMPLETED",
  ].includes(status);
}

function isPaymentFailed(status: string): boolean {
  return [
    "FAILED",
    "FAILURE",
    "CANCELLED",
    "CANCELED",
    "REJECTED",
    "EXPIRED",
  ].includes(status);
}

export default function PaymentModal({
  isOpen,
  onClose,
  selectedPlan,
  onSuccessfulPayment,
  onPaymentCompleted,
}: PaymentModalProps) {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const [partners, setPartners] = useState<PaymentPartner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [backendErrorDetails, setBackendErrorDetails] = useState("");
  const [logoErrors, setLogoErrors] = useState<string[]>([]);
  const [showDebugDetails, setShowDebugDetails] = useState(false);

  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [pollAttempt, setPollAttempt] = useState(0);
  const [pollVersion, setPollVersion] = useState(0);

  const requestInProgressRef = useRef(false);
  const handledTransactionRef = useRef<string | null>(null);

  const selectedPartner = partners.find(
    (partner) => partner.code === selectedProvider
  );

  const paymentPending =
    Boolean(transactionId) &&
    ["PENDING", "PROCESSING", "TIMEOUT"].includes(paymentStatus);

  /*
   * ============================================================
   * FETCH PAYMENT PARTNERS
   * ============================================================
   */

  const fetchPartners = useCallback(async () => {
    setPartnersLoading(true);
    setError("");
    setBackendErrorDetails("");

    try {
      const response = await axios.get(PARTNERS_ENDPOINT, {
        timeout: 15000,
      });

      const availablePartners = normalizePartners(response.data);

      setPartners(availablePartners);

      setSelectedProvider((current) =>
        availablePartners.some((partner) => partner.code === current)
          ? current
          : availablePartners[0]?.code ?? ""
      );

      setLogoErrors([]);

      if (availablePartners.length === 0) {
        setError("No payment providers are currently available.");
      }
    } catch (err: any) {
      console.error("Failed to fetch payment partners:", err);

      setPartners([]);
      setSelectedProvider("");
      setError(getErrorMessage(err));
      setBackendErrorDetails(getBackendErrorDetails(err));
    } finally {
      setPartnersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    void fetchPartners();
  }, [isOpen, fetchPartners]);

  /*
   * ============================================================
   * PAYMENT STATUS POLLING
   * ============================================================
   */

  useEffect(() => {
    if (!isOpen || !transactionId || !paymentPending) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const checkPaymentStatus = async () => {
      if (cancelled) return;

      try {
        const response = await axios.get(
          `${PAYMENT_STATUS_ENDPOINT}/${encodeURIComponent(transactionId)}`,
          { timeout: 15000 }
        );

        if (cancelled) return;

        const data = response.data?.data ?? response.data;
        const status = getPaymentStatus(data);

        setBackendErrorDetails("");
        setError("");

        setPollAttempt(attempts + 1);

        if (isPaymentSuccessful(status)) {
          setPaymentStatus("SUCCESS");
          setPaymentMessage(
            data?.message ??
              "Your payment has been confirmed successfully."
          );

          if (handledTransactionRef.current !== transactionId) {
            handledTransactionRef.current = transactionId;
            onPaymentCompleted?.(data);
            onSuccessfulPayment(
              data?.message ?? "Payment completed successfully."
            );
          }

          return;
        }

        if (isPaymentFailed(status)) {
          setPaymentStatus("FAILED");
          setPaymentMessage(
            data?.message ?? "The payment could not be completed."
          );

          if (handledTransactionRef.current !== transactionId) {
            handledTransactionRef.current = transactionId;
            onPaymentCompleted?.(data);
          }

          return;
        }

        // Unknown or non-final statuses continue polling.
        setPaymentStatus("PENDING");

        setPaymentMessage(
          data?.message ??
            (status
              ? `Payment status: ${status}. Waiting for confirmation.`
              : "Waiting for payment confirmation.")
        );
      } catch (err: any) {
        if (cancelled) return;

        console.error("Payment status check failed:", err);

        setBackendErrorDetails(getBackendErrorDetails(err));
        setError(
          `Could not check payment status: ${getErrorMessage(err)}`
        );

        // A temporary request error does not prove the payment failed.
        setPaymentStatus("PENDING");
      }

      attempts += 1;
      setPollAttempt(attempts);

      if (attempts < MAX_POLL_ATTEMPTS && !cancelled) {
        timeoutId = setTimeout(
          checkPaymentStatus,
          POLL_INTERVAL_MS
        );
      } else if (!cancelled) {
        setPaymentStatus("TIMEOUT");
        setPaymentMessage(
          "We have not received a final payment status yet. Your payment may still be processing."
        );
      }
    };

    setPollAttempt(0);
    void checkPaymentStatus();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    isOpen,
    transactionId,
    paymentPending,
    pollVersion,
    onPaymentCompleted,
    onSuccessfulPayment,
  ]);

  /*
   * ============================================================
   * RESET PAYMENT
   * ============================================================
   */

  const resetPayment = () => {
    setTransactionId(null);
    setPaymentStatus("");
    setPaymentMessage("");
    setPollAttempt(0);
    setError("");
    setBackendErrorDetails("");
    setShowDebugDetails(false);
    setPollVersion((value) => value + 1);
    handledTransactionRef.current = null;
  };

  /*
   * ============================================================
   * CLOSE MODAL
   * ============================================================
   */

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  /*
   * ============================================================
   * INITIATE PAYMENT
   * ============================================================
   */

  const handlePaySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (requestInProgressRef.current || paymentPending) return;

    setError("");
    setBackendErrorDetails("");
    setShowDebugDetails(false);

    if (!selectedPlan) {
      setError("Please select a subscription plan.");
      return;
    }

    if (!selectedPartner) {
      setError("Please select a payment provider.");
      return;
    }

    const phoneForApi = normalizePhoneNumber(phoneNumber);

    if (!phoneForApi) {
      setError(
        "Enter a valid Tanzanian mobile number, e.g. 0712345678 or 255712345678."
      );
      return;
    }

    if (!email.trim()) {
      setError("Please enter your account email.");
      return;
    }

    requestInProgressRef.current = true;
    setLoading(true);

    try {
      const requestBody = {
        planId: selectedPlan.id,
        email: email.trim(),
        phoneNumber: phoneForApi,
        provider: selectedPartner.provider,
      };

      console.info("Initiating payment:", {
        endpoint: INITIATION_ENDPOINT,
        planId: selectedPlan.id,
        provider: selectedPartner.provider,
        // Do not log email or phone number in production.
      });

      const response = await axios.post(
        INITIATION_ENDPOINT,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      const responseData = response.data;
      const newTransactionId = getTransactionId(responseData);

      console.info("Payment initiation response:", responseData);

      if (!newTransactionId) {
        setBackendErrorDetails(
          JSON.stringify(
            {
              endpoint: INITIATION_ENDPOINT,
              httpStatus: response.status,
              message: "The API did not return a transaction ID.",
              response: responseData,
            },
            null,
            2
          )
        );

        throw new Error(
          "The server did not return a transaction ID. Check the Backend Debug Details."
        );
      }

      handledTransactionRef.current = null;

      setTransactionId(newTransactionId);
      setPaymentStatus("PENDING");
      setPaymentMessage(
        responseData?.message ??
          `Payment request sent to ${phoneForApi}. Please check your phone and confirm the payment.`
      );
      setPollAttempt(0);
      setError("");
      setBackendErrorDetails("");
      setShowDebugDetails(false);
    } catch (err: any) {
      console.error("Payment initiation failed:", err);

      setError(getErrorMessage(err));

      // Preserve the response body and HTTP status for debugging.
      if (!backendErrorDetails) {
        setBackendErrorDetails(getBackendErrorDetails(err));
      }
    } finally {
      requestInProgressRef.current = false;
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  if (!isOpen || !selectedPlan) return null;

  const isSuccess = paymentStatus === "SUCCESS";
  const isFailed = paymentStatus === "FAILED";
  const isTimeout = paymentStatus === "TIMEOUT";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-5 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="relative my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          aria-label="Close payment modal"
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        >
          <X className="h-6 w-6" />
        </button>

        {/* PLAN INFORMATION */}

        <div className="mb-6 pr-8">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#357738]">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h3
            id="payment-modal-title"
            className="text-xl font-bold text-slate-900"
          >
            {isSuccess ? "Payment Confirmed" : "Complete Payment"}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Selected Package
          </p>

          <p className="font-semibold text-[#357738]">
            {selectedPlan.name}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            TZS {selectedPlan.price.toLocaleString()}
          </p>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div
            role="alert"
            className="mb-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        {/* BACKEND DEBUG DETAILS */}

        {backendErrorDetails && (
          <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-3">
            <button
              type="button"
              onClick={() =>
                setShowDebugDetails((value) => !value)
              }
              className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-amber-900"
              aria-expanded={showDebugDetails}
            >
             

              <span>{showDebugDetails ? "−" : "+"}</span>
            </button>

            {showDebugDetails && (
              <div className="mt-3">
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md border border-amber-200 bg-white p-3 text-xs text-slate-800">
                  {backendErrorDetails}
                </pre>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard?.writeText) {
                      void navigator.clipboard
                        .writeText(backendErrorDetails)
                        .then(() =>
                          toast.success(
                            "Backend error details copied"
                          )
                        )
                        .catch(() =>
                          toast.error("Unable to copy details")
                        );
                    } else {
                      toast.error(
                        "Clipboard is not available in this browser."
                      );
                    }
                  }}
                  className="mt-2 rounded-md bg-amber-800 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-900"
                >
                  Copy error details
                </button>
              </div>
            )}
          </div>
        )}

        {/* PAYMENT STATUS */}

        {transactionId && (    
          <div
            role="status"
            aria-live="polite"
            className={`mb-5 rounded-xl border p-4 ${
              isSuccess
                ? "border-green-200 bg-green-50 text-green-800"
                : isFailed
                ? "border-red-200 bg-red-50 text-red-800"
                : isTimeout
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {isSuccess ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              ) : isFailed ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              ) : isTimeout ? (
                <Clock className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
              )}

              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {isSuccess
                    ? "Payment Recieved you can login to Your Account at jemigrapher Application ."
                    : isFailed
                    ? "Payment failed"
                    : isTimeout
                    ? "Confirmation is taking longer than expected"
                    : "Waiting for payment confirmation"}
                </p>

                <p className="mt-1 break-words text-sm">
                  {paymentMessage ||
                    "Please check your phone and follow the mobile money instructions."}
                </p>

                <p className="mt-2 break-all text-xs opacity-75">
                  Transaction ID: {transactionId}
                </p>

                {paymentPending && (
                  <p className="mt-1 text-xs opacity-75">
                    Status checks: {pollAttempt}/{MAX_POLL_ATTEMPTS}
                  </p>
                )}

                {isTimeout && (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setBackendErrorDetails("");
                      setPaymentStatus("PENDING");
                      setPollVersion((value) => value + 1);
                    }}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-current px-3 py-2 text-sm font-semibold"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Check status again
                  </button>
                )}

                {isSuccess && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 rounded-lg bg-[#357738] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Done
                  </button>
                )}

                {isFailed && (
                  <button
                    type="button"
                    onClick={resetPayment}
                    className="mt-3 rounded-lg border border-current px-3 py-2 text-sm font-semibold"
                  >
                    Try another payment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT FORM */}

        {!transactionId && (
          <form onSubmit={handlePaySubmit} className="space-y-5">
            {/* PAYMENT PROVIDERS */}

            <section>
              <div className="mb-3 flex items-center justify-between gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Choose Payment Method
                </label>

                <button
                  type="button"
                  onClick={() => void fetchPartners()}
                  disabled={partnersLoading || loading}
                  aria-label="Refresh payment providers"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#357738] hover:underline disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      partnersLoading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </button>
              </div>

              {partnersLoading ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-8 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading payment providers...
                </div>
              ) : partners.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {partners.map((partner) => {
                    const selected =
                      selectedProvider === partner.code;
                    const logoFailed = logoErrors.includes(
                      partner.code
                    );

                    return (
                      <button
                        type="button"
                        key={partner.id}
                        disabled={loading}
                        onClick={() => {
                          setSelectedProvider(partner.code);
                          setError("");
                          setBackendErrorDetails("");
                        }}
                        aria-pressed={selected}
                        className={`relative flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 transition ${
                          selected
                            ? "border-[#357738] bg-green-50 ring-1 ring-[#357738]"
                            : "border-slate-200 bg-white hover:border-slate-400"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {selected && (
                          <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-[#357738]" />
                        )}

                        <div className="flex h-12 w-16 items-center justify-center">
                          {partner.logo && !logoFailed ? (
                            <img
                              src={partner.logo}
                              alt={`${partner.name} logo`}
                              loading="lazy"
                              className="max-h-full max-w-full object-contain"
                              onError={() =>
                                setLogoErrors((current) =>
                                  current.includes(partner.code)
                                    ? current
                                    : [...current, partner.code]
                                )
                              }
                            />
                          ) : (
                            <Smartphone className="h-7 w-7 text-slate-500" />
                          )}
                        </div>

                        <span className="text-center text-xs font-semibold leading-tight text-slate-700">
                          {partner.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => void fetchPartners()}
                  className="w-full rounded-xl border border-slate-300 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Unable to load providers. Tap to retry.
                </button>
              )}

              {selectedPartner && !partnersLoading && (
                <p className="mt-2 text-xs text-slate-500">
                  Selected:{" "}
                  <span className="font-semibold text-[#357738]">
                    {selectedPartner.name}
                  </span>
                </p>
              )}
            </section>

            {/* EMAIL */}

            <div>
              <label
                htmlFor="payment-email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Your Account Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="payment-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="user@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#357738] focus:ring-2 focus:ring-[#357738]/20 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* PHONE NUMBER */}

            <div>
              <label
                htmlFor="payment-phone"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Payment Phone Number
              </label>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="payment-phone"
                  type="tel"
                  inputMode="tel"
                  required
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(event.target.value)
                  }
                  placeholder="0712345678"
                  autoComplete="tel"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#357738] focus:ring-2 focus:ring-[#357738]/20 disabled:bg-slate-50"
                />
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Enter the mobile number linked to your selected payment provider.
              </p>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                loading ||
                partnersLoading ||
                !selectedPartner ||
                partners.length === 0
              }
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#357738] py-3 font-semibold text-white shadow-md transition hover:bg-[#2d6430] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Initiating payment...
                </>
              ) : (
                `Pay TZS ${selectedPlan.price.toLocaleString()}`
              )}
            </button>

            <p className="flex items-center justify-center gap-1 text-center text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Follow the payment instructions sent to your phone.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
