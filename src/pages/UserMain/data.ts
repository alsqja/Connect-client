export interface ICalendarSchedule {
  id: number;
  date: string;
  title: string;
  details: string;
  contentNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IPostSubCategories {
  id: number;
  name: string;
  description: string;
}

export interface IPostScheduleData {
  date: string | null;
  title: string | null;
  details: string | null;
  contents: { id: number; description: string }[];
  address: string;
  latitude: number;
  longitude: number;
}
