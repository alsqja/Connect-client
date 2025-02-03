import { PaymentType } from "../AdminPaymentManage/data";

export interface MembershipRequest {
  payUid: string;
  amount: number;
  details: string;
  type: PaymentType;
  status: string;
  cardNumber: string;
  expiredYear: string;
  expiredMonth: string;
  cardPassword: string;
  birth: string;
}

export interface EncryptData {
  encryptData: string;
}
