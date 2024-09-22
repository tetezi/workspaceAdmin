import { baseHttp } from "@/utils/http";

export type DynamicFormViewComp = {
  id: UUID;
  name: string;
  tableColumns: Recordable[];
  dataSourceType: string;
  dynamicTableId?: UUID;
  formSourceType: string;
  dynamicFormId?: UUID;
};
export async function GetDynamicFormViewComps(params: PaginatedRequest) {
  return baseHttp.get<DynamicFormViewComp[]>(
    {
      url: "/dynamic/formViewComp/getFormViewComps",
    },
    params
  );
}

export async function GetDynamicFormViewComp(id: UUID) {
  return baseHttp.get<DynamicFormViewComp>(
    {
      url: "/dynamic/formViewComp/getFormViewComp",
    },
    { id }
  );
}

export async function SaveDynamicFormViewComp(
  params: MakePartialAndRemove<DynamicFormViewComp, "id">
) {
  return baseHttp.post(
    {
      url: "/dynamic/formViewComp/saveFormViewComp",
    },
    params
  );
}
export async function DelDynamicFormViewComp(id: UUID) {
  return baseHttp.post(
    {
      url: "/dynamic/formViewComp/delFormViewComp",
    },
    { id }
  );
}
