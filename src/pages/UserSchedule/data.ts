export interface IContent {
  id: number;
  subCategoryId: number;
  subCategoryName: string;
  description: string;
  subCategoryImageUrl: string;
}

export interface ISchedule {
  id: number;
  date: string;
  title: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

export interface IScheduleMatching {
  id: number;
  toScheduleId: number;
  fromScheduleId: number;
  toUserId: number;
  fromUserId: number;
  toUserName: string;
  fromUserName: string;
  toUserProfileUrl: string;
  fromUserProfileUrl: string;
  similarity: number;
  matchStatus: "ACCEPTED" | "PENDING";
  createdAt: string;
  updatedAt: string;
}

export interface ICreatedMatching {
  id: number;
  toScheduleId: number;
  userId: number;
  userName: string;
  profileUrl: string;
  similarity: number;
  createdAt: string;
  updatedAt: string;
}
