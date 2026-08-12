interface Booking {
  id: string;
  bookingReference?: string;
  clientName?: string;
  photographerName?: string;
  status: string;
  bookingType?: string;
  amount: number;
  scheduledAt?: string;
  createdAt: string;
}