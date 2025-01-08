// types.ts
export interface IUserData {
  id: number;
  name: string;
  birth: string;
  gender: string;
  profileUrl: string;
  status: string;
  isActiveMatching: boolean;
  role: string;
  memberType: string | null;
  reportCount: number;
  expiredDate: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export const tableHeaders: string[] = [
  "ID",
  "이름",
  "생년월일",
  "성별",
  "상태",
  "매칭허용",
  "유저",
  "신고횟수",
  "멤버십",
  "멤버십 종료",
  "가입일",
  "탈퇴",
  "수정 적용",
];

export interface IAdminUpdateUserData {
  status: "NORMAL" | "REJECTED" | null | string;
  isDeleted: boolean | null;
  role: "USER" | "ADMIN" | null | string;
}
