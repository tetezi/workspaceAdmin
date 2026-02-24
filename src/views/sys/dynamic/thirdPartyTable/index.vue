<template>
  <div style="height: 100%; box-sizing: border-box; padding: 8px">
    <TableComp style="padding: 8 16px"> </TableComp>
    <DialogFormComp> </DialogFormComp>
  </div>
</template>
<script lang="tsx" setup>
import {
  GetDynamicThirdPartyTables,
  GetDynamicThirdPartyTable,
  SaveDynamicThirdPartyTable,
  DelDynamicThirdPartyTable,
} from "@/api/sys/dynamic/thirdPartyTable";

import { useTable, BasicButton, useDialogForm } from "ttz-ui";
const [DialogFormComp, dialogFormMethods] = useDialogForm<any>({
  width: "95%",
  closeOnClickModal: false,
  labelPosition: "top",
  formSchemas: [
    { field: "name", label: "名称", component: "Input", colProps: { span: 6 } },
    // { field: "key", label: "主键", component: "Input", colProps: { span: 6 } },
    { field: "addUrl", label: "新增接口", component: "Input" },
    { field: "delUrl", label: "删除接口", component: "Input" },
    { field: "editUrl", label: "编辑接口", component: "Input" },
    { field: "getListUrl", label: "查询列表接口", component: "Input" },
    { field: "getDetailUrl", label: "查询详情接口", component: "Input" },
    { field: "description", label: "备注", component: "Input" },
  ],
  submitApi: async (formData) => {
    return SaveDynamicThirdPartyTable(formData);
  },
  onClosed: () => tableMethods.reload(),
});
const [TableComp, tableMethods] = useTable<Recordable>({
  rowKey: "id",
  columns: [
    // { prop: 'id', label: 'id' },
    { prop: "name", label: "名称" },
    // { prop: "key", label: "主键" },
    { prop: "addUrl", label: "新增接口" },
    { prop: "delUrl", label: "删除接口" },
    { prop: "editUrl", label: "编辑接口" },
    { prop: "getListUrl", label: "查询列表接口" },
    { prop: "getDetailUrl", label: "查询详情接口" },
    { prop: "description", label: "备注" },

    { prop: "createdAt", label: "创建时间" },
    { prop: "updatedAt", label: "编辑时间" },
  ],
  api: async (params, pageParams) => {
    return await GetDynamicThirdPartyTables(pageParams);
  },
  actionColumn: (row) => {
    return (
      <div>
        <BasicButton func={() => edit(row)}>编辑</BasicButton>
        <BasicButton func={() => del(row)} isConfirm type="danger">
          删除
        </BasicButton>
      </div>
    );
  },
  headerActionRender: () => (
    <BasicButton func={add} type="primary">
      新增
    </BasicButton>
  ),
  title: "外部数据源管理",
});
async function add() {
  dialogFormMethods.open({
    name: "",
    key: "id",
    addUrl: "",
    delUrl: "",
    editUrl: "",
    getListUrl: "",
    getDetailUrl: "",
    description: "",
  });
}
async function edit(row) {
  const tableData = await GetDynamicThirdPartyTable(row.id);

  dialogFormMethods.open(tableData);
}
async function del(row) {
  await DelDynamicThirdPartyTable(row.id);

  await tableMethods.reload();
}
</script>
