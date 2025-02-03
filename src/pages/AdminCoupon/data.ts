export interface AdminCouponReq {
  name: string,
  description: string,
  count: number,
  amount: number,
  expiredDate: string,
  openDate: string,
}

export interface AdminCouponRes {
  id: number,
  name: string,
  description: string,
  count: number,
  amount: number,
  expiredDate: string,
  openDate: string,
  isDeleted: boolean,
  createdAt: string,
  updatedAt: string,
}

export interface AdminCouponUpdateReq {
  name: string,
  description: string,
  count: number,
  amount: number,
  expiredDate: string,
  openDate: string,
  isDeleted: boolean,
}

export type couponFilter = "ALL" | "ISSUED_COUPON" | "WAITING_COUPON";