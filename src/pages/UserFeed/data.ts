export interface Post {
  id: number;
  url: string;
  description: string;
  createdAt: string;
}

export interface IFeedProfile {
  id: number;
  name: string;
  birth: string;
  gender: string;
  profileUrl: string;
}

export interface IFeedDetail {
  id: number;
  url: string;
  description: string;
  userName: string;
  userId: number;
  userProfileUrl: string;
  createdAt: string;
  updatedAt: string;
}
