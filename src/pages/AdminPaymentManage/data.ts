export interface PaymentData {
  id: number,
  payUid: string,
  portoneUid: string,
  amount: number,
  type: PaymentType,
  status: PaymentStatus,
  details: PaymentStatus,
  userEmail: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface PaymentRequestType {
  payUid: string,
  portoneUid: string,
  amount: number,
  details: string,
  type: string
  status: string,
}

export interface PaymentCancelRequest {
  paymentId: number,
  amount: number,
  reason: string
}

type PaymentStatus =
  'CANCELLED' |
  'FAILED' |
  'PAID' |
  'PAY_PENDING' |
  'READY';

export type PaymentType = 'POINT' | 'SUBSCRIBE'
