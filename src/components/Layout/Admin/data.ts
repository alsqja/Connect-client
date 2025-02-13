export interface INaviData {
  path: string;
  label: string;
  id: number;
}

export const AdminNaviData: INaviData[] = [
  {
    id: 1,
    path: "/admin/chart",
    label: "매출 통계",
  },
  {
    id: 2,
    path: "/admin/payment",
    label: "결제 내역",
  },
  {
    id: 3,
    path: "/admin/category",
    label: "카테고리 관리",
  },
  {
    id: 5,
    path: "/admin/coupon",
    label: "쿠폰 생성",
  },
  {
    id: 6,
    path: "/admin/user",
    label: "유저 관리",
  },
];
