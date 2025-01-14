export interface IUserWithToken {
  accessToken: string | null;
  refreshToken: string | null;
  id: number | null;
  role: "USER" | "ADMIN" | null;
  memberType: "PREMIUM" | null;
  expiredDate: string | null;
  name: string | null;
  profileUrl: string | null;
  email: string | null;
}
