import { IOption } from "../../components/Dropdown";

export const UserSidebarData: IOption[] = [
  {
    id: 1,
    label: "마이 페이지",
  },
  {
    id: 2,
    label: "결제 정보",
  },
  {
    id: 3,
    label: "일정 내역",
  },
  {
    id: 4,
    label: "포인트 내역",
  },
  {
    id: 5,
    label: "쿠폰 내역",
  },
  {
    id: 6,
    label: "신고 내역",
  },
  {
    id: 7,
    label: "알림",
  },
];

export interface ProfileData {
  id: number;
  email: string;
  name: string;
  birth: string;
  gender: string;
  profileUrl: string;
  isActiveMatching: boolean;
  membershipType: string;
  expiredDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name: string | null;
  profileUrl: null | string;
  isActiveMatching: boolean;
  oldPassword: string | null;
  newPassword: string | null;
}

export interface ISchedule {
  id: number;
  date: string;
  title: string;
  details: string;
  contentNames: string[];
  createdAt: string;
  updatedAt: string;
}
