export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  position: number;
  joinedAt: Date;
}
