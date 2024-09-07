import { baseHttp } from "@/utils/http";

export type DynamicFormType = {
  id: UUID;
  name: string;
  beforeSubmit?: string;
  schemas: string;
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
  return baseHttp.get<DynamicFormType>(
    {
      url: "/dynamic/form/getForm",
    },
    { id }
  );
}
export async function SaveDynamicForm(
  params: MakePartialAndRemove<DynamicFormType, "id">
) {
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
