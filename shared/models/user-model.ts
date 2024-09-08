export interface UserModel {
  staffId: number | null;
  userId: number;
  individualId: number | null;
  email: string;
  emailConfirmed: boolean | null;
  tacAccepted: boolean | null;
  token: string;
  tokenExpiry: Date;
}
