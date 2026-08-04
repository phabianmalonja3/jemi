"use client";

import React, { useState, useEffect } from "react";
import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  description: string;
  active: boolean;
  createdAt: string;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch(`${API_URL}/subscription-plans`);
        if (!response.ok) {
          throw new Error("Failed to fetch subscription plans");
        }
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        // Tukiweka tupu hapa, itafanya plans ziwe array tupu [] endapo API haipatikani
        setPlans([]);
      } finally {
        setFetchingPlans(false);
      }
    }

    fetchPlans();
  }, [API_URL]);

  const handleSubscribe = async (planId: string) => {
    if (!phoneNumber) {
      setErrorMessage("Please enter your mobile phone number for payment.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedPlanId(planId);

    try {
      const response = await fetch(`${API_URL}/payments/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          planId: planId,
          phoneNumber: phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate payment request. Please try again.");
      }

      const resultText = await response.text();
      setSuccessMessage(resultText || "Payment prompt sent to your phone. Please confirm.");
    } catch (err: any) {
      setErrorMessage(err.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Choose Your Subscription Package
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Pay easily through your mobile phone and continue enjoying our services seamlessly.
          </p>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
        </div>

        {fetchingPlans ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-[#357738]" />
            <span className="ml-2 text-slate-600">Loading packages...</span>
          </div>
        ) : plans.length === 0 ? (
          // Hapa ndipo ujumbe utakapojitokeza kama hakuna vifurushi vilivyopatikana
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-xl mx-auto p-8">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Packages Available</h3>
            <p className="mt-2 text-sm text-slate-500">
              There are currently no active subscription packages available. Please check back later or contact support.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-x-8">
            {plans.map((plan) => {
              const isPopular = plan.name === "QUARTERLY";
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-xl border ${
                    isPopular ? "border-[#357738] ring-2 ring-[#357738] " : "border-slate-200"
                  } p-8 flex flex-col justify-between`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[#357738] text-white shadow-md">
                        <Sparkles className="w-3 h-3 mr-1" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-slate-950 uppercase tracking-wide">{plan.name}</h3>
                    <p className="mt-4 text-slate-500 text-sm">{plan.description}</p>
                    
                    <div className="mt-6">
                      <span className="text-4xl font-extrabold text-slate-900">
                        TZS {plan.price.toLocaleString()}
                      </span>
                      <span className="text-base font-medium text-slate-500"> / {plan.durationInDays} days</span>
                    </div>

                    <ul className="mt-6 space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-sm text-slate-600">Access for {plan.durationInDays} days</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-sm text-slate-600">Full system capabilities</p>
                      </li>
                    </ul>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}