export interface IChat {
  senderId: number;
  name: string;
  email: string;
  profileUrl: string;
  message: string;
  createdAt: string;
}

export interface IChatroom {
  chatroomId: number;
  matchingId: number;
  date: string;
  title: string;
  detail: string;
  address: string;
  fromSchedueUserName: String;
  toSchedueUserName: string;
}
