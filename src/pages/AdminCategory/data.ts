export interface ISubCategory {
  id: number;
  name: string;
  imageUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryAndSub {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  subCategories: ISubCategory[];
}
