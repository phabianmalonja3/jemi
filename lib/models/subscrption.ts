interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  description: string;
  active: boolean;
  createdAt: string;
}