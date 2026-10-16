// types/payment.ts

export interface PaymentPartner {
  id: string;
  logoUrl: string;
  partnerName: string;
  provider: number;
  vendorName: string;
  paymentVendorId: string;
  paymentPartnerId: string;
  paymentAcknowledgmentRoute: string;
  currency: string;
  status: string;
  vendorType: string;
  partnerType: string;
}

export interface PaymentRequestPayload {
 
  paymentPartnerId: string;
  amount: number;
  phoneNumber: string;
  referenceId: string;
}