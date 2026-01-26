<!--
 * @Author: tetezi MaHouShouJoTetezi@foxmail.com
 * @Date: 2024-09-18 15:15:46
 * @LastEditors: tetezi MaHouShouJoTetezi@foxmail.com
 * @LastEditTime: 2025-11-20 19:36:25
 * @FilePath: \workspaceAdmin\src\views\sys\admin\enum\index.vue
 * @Description: 
-->
<template>
  <div style="height: 100%; box-sizing: border-box; padding: 8px">
    <EnumTableComp style="padding: 8 16px"> </EnumTableComp>
    <SaveEnumDialogComp> </SaveEnumDialogComp>
  </div>
</template>
<script lang="tsx" setup>
import {
  DelEnumCategory,
  GetEnumCategorys,
  SaveEnumCategory,
  type SaveEnumCategoryParamsType,
} from "@/api/sys/enum";
import { BasicButton, useDialogForm, useTable } from "ttz-ui";
import { pick } from "lodash";
const [EnumTableComp, enumTableMethods] = useTable({
  columns: [
    { prop: "name", label: "名称" },
    { prop: "title", label: "标题" },
    {
      prop: "details",
      label: "详情",
      formatter: (row, details) => {
        return details.map((detail) => {
          return <el-tag>{detail.name}</el-tag>;
        });
      },
    },
    { prop: "description", label: "备注" },
    { prop: "createdAt", label: "创建时间" },
    { prop: "updatedAt", label: "修改时间" },
  ],
  api: async (_params, pageParams) => {
    return await GetEnumCategorys(pageParams);
  },
  actionColumn: (row) => {
    return (
      <div>
        <BasicButton func={() => edit(row)}> 编辑 </BasicButton>
        <BasicButton func={() => del(row)} type="danger" isConfirm>
          删除
        </BasicButton>
      </div>
    );
  },
  headerActionRender: (
    <BasicButton func={add} type="primary">
      新增
    </BasicButton>
  ),
  title: `枚举管理表`,
});
const [SaveEnumDialogComp, saveEnumDialogMethods] =
  useDialogForm<SaveEnumCategoryParamsType>({
    labelPosition: "top",
    formSchemas: [
      {
        field: "name",
        component: "Input",
        colProps: { span: 12 },
        label: "名称（英）",
        componentProps: { placeholder: "请输入英文名称" },
      },
      {
        field: "title",
        component: "Input",
        colProps: { span: 12 },
        label: "标题（中）",
        componentProps: { placeholder: "请输入中文标题" },
      },
      {
        field: "details",
        component: "EditableTable",
        label: "详情",
        componentProps: () => {
          return {
            columns: [
              //TODO 前端功能未实现，暂时注释
              //   {
              //     prop: "tagColor",
              //     label: "标签颜色",
              //     editConfig: {
              //       component: "ColorPicker",
              //       componentProps: {
              //         colorFormat: "hex",
              //         predefine: [
              //           "#ff4500",
              //           "#ff8c00",
              //           "#ffd700",
              //           "#90ee90",
              //           "#00ced1",
              //           "#1e90ff",
              //           "#c71585",
              //         ],
              //       },
              //     },
              //   },
              {
                prop: "name",
                label: "名称",
                editConfig: {
                  component: "Input",
                },
              },
              {
                prop: "value",
                label: "值",
                editConfig: {
                  component: "Input",
                },
              },

              {
                prop: "description",
                label: "备注",
                editConfig: {
                  component: "Input",
                },
              },
            ],
          };
        },
      },
      {
        field: "description",
        component: "Input",
        label: "备注",
        componentProps: {
          type: "textarea",
          autosize: { minRows: 5, maxRows: 5 },
        },
      },
    ],
    title: `枚举管理`,
    closeOnClickModal: false,
    submitApi: SaveEnumCategory,
    onClose: () => {
      enumTableMethods.reload();
    },
  });
async function add() {
  return await saveEnumDialogMethods.open({
    name: "",
    title: "",
    details: [],
  });
}
async function edit(row) {
  return await saveEnumDialogMethods.open({
    id: row.id,
    name: row.name,
    title: row.title,
    details: row.details.map((detail) =>
      pick(detail, ["id", "name", "value", "tagColor", "description"]),
    ),
    description: row.description,
  });
}
async function del(row) {
  return await DelEnumCategory(row.id);
}
</script>
