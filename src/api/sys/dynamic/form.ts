import { baseHttp } from "@/utils/http";

export type DynamicForm = {
  id?: UUID;
  name: string;
  schemas: any[];
  description?: string;
};
export async function GetDynamicForms(params: PaginatedRequest) {
  return baseHttp.get(
    {
      url: "/dynamic/form/getForms",
    },
    params
  );
}

export async function GetDynamicForm(id: UUID) {
  return baseHttp.get(
    {
      url: "/dynamic/form/getForm",
    },
    { id }
  );
}

export async function SaveDynamicForm(params: DynamicForm) {
  return baseHttp.post(
    {
      url: "/dynamic/form/saveForm",
    },
    params
  );
}
export async function DelDynamicForm(id: UUID) {
  return baseHttp.post(
    {
      url: "/dynamic/form/delForm",
    },
    { id }
  );
}
