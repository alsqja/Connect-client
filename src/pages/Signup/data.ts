export interface ISignupValues {
  email: string;
  password: string;
  name: string;
  birth: string;
  gender: "MAN" | "WOMAN";
  isActiveMatching: boolean;
  profileUrl: string;
  role: "ADMIN" | "USER";
}
