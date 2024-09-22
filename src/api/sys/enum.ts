import { baseHttp } from "@/utils/http";
export type EnumDetailType = {
  id: UUID;
  name: string;
  value: string;
  description?: string;
};
export type EnumCategoryType = {
  id: UUID;
  name: string;
  title: string;
  description?: string;
  details: EnumDetailType[];
};
export type SaveEnumCategoryParamsType = {
  id?: UUID;
  name: string;
  title: string;
  description?: string;
  details: {
    id?: UUID;
    name: string;
    value: string;
    description?: string;
  }[];
};
export async function GetEnumCategorys(params: PaginatedRequest) {
  return baseHttp.get(
    {
      url: "/enum/getEnumCategorys",
    },
    params
  );
}

export async function GetEnumCategory(categoryName: string) {
  return baseHttp.get<EnumCategoryType>(
    {
      url: "/enum/getEnumCategory",
    },
    { categoryName }
  );
}
export async function SaveEnumCategory(
  saveEnumCategoryParams: SaveEnumCategoryParamsType
) {
  return baseHttp.post(
    {
      url: "/enum/saveEnumCategory",
    },
    saveEnumCategoryParams
  );
}

export async function DelEnumCategory(id: UUID) {
  return baseHttp.post(
    {
      url: "/enum/delEnumCategory",
    },
    { id }
  );
}
