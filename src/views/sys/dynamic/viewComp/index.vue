<template>
  <div style="height: 100%; box-sizing: border-box; padding: 8px">
    <TableComp style="padding: 8 16px"> </TableComp>
    <DialogFormComp> </DialogFormComp>
  </div>
</template>
<script lang="tsx" setup>
import {
  DelDynamicFormViewComp,
  GetDynamicFormViewComp,
  GetDynamicFormViewComps,
  SaveDynamicFormViewComp,
  type DynamicFormViewComp,
} from "@/api/sys/dynamic/formViewComp";
import { useTable, BasicButton, useDialogForm } from "ttz-ui";
import { omit } from "lodash";
import { GetDynamicForms } from "@/api/sys/dynamic/form";
import { GetDynamicTables } from "@/api/sys/dynamic/table";
const dataSourceTypeOptions = [
  { value: "DynamicTable", label: "轻代码数据表" },
];
const formSourceTypeOptions = [{ value: "DynamicForm", label: "轻代码表单" }];
const [DialogFormComp, dialogFormMethods] = useDialogForm<
  MakePartialAndRemove<DynamicFormViewComp, "id">
>({
  labelWidth: "100px",
  width: "90%",
  closeOnClickModal: false,
  formSchemas: [
    {
      field: "name",
      label: "名称",
      component: "Input",
    },
    {
      category: "Container",
      component: "Row",
      children: [
        {
          colProps: { span: 6 },
          field: "dataSourceType",
          label: "数据源类型",
          component: "Select",
          componentProps: {
            options: dataSourceTypeOptions,
          },
        },
        {
          colProps: { span: 6 },
          field: "dynamicTableId",
          label: "轻代码数据表",
          component: "ApiSelect",
          componentProps: ({ formMethods }) => ({
            api: GetDynamicTables,
            labelField: "name",
            valueField: "id",
            placeholder: "请选择轻代码数据表",
            immediate: true,
            onChange: (
              val: string | Recordable,
              option?: Recordable | undefined
            ) => {
              formMethods.setFieldsValue(
                "tableColumns",
                (option?.cols || []).map((col) => {
                  let prop = col.name;
                  if (col.colType === "Enum") {
                    prop = `${col.name}_desc`;
                  }
                  return {
                    prop: prop,
                    label: col.name,
                    width: "",
                    showOverflowTooltip: false,
                    transform: "",
                  };
                })
              );
            },
          }),
          ifShow: ({ formValue }) =>
            formValue.dataSourceType === "DynamicTable",
          labelShow: false,
        },
        {
          colProps: { span: 6 },
          field: "formSourceType",
          label: "表单源类型",
          component: "Select",
          componentProps: {
            options: formSourceTypeOptions,
          },
        },
        {
          colProps: { span: 6 },
          field: "dynamicFormId",
          label: "轻代码表单",
          component: "ApiSelect",
          componentProps: {
            api: GetDynamicForms,
            labelField: "name",
            valueField: "id",
            placeholder: "请选择轻代码表单",
            immediate: true,
          },
          ifShow: ({ formValue }) => formValue.formSourceType === "DynamicForm",
          labelShow: false,
        },
      ],
    },
    {
      field: "tableColumns",
      label: "表格列配置",
      component: "EditableTable",
      componentProps: {
        columns: [
          {
            prop: "prop",
            label: "字段名",
            editConfig: {
              component: "Input",
            },
          },
          {
            prop: "label",
            label: "列名",
            editConfig: {
              component: "Input",
            },
          },
          {
            prop: "showOverflowTooltip",
            label: "溢出提示",
            editConfig: {
              component: "Switch",
            },
            width: "100px",
          },
          {
            prop: "width",
            label: "宽度",
            editConfig: {
              component: "Input",
              componentProps: {
                placeholder: "留空为自动计算",
              },
            },
            width: "200px",
          },
          {
            prop: "transform",
            label: "转换函数",
            editConfig: {
              component: "Input",
              componentProps: {
                type: "textarea",
                placeholder: "留空不进行转换",
                autosize: { minRows: 1, maxRows: 5 },
              },
            },
          },
        ],
        addBtnValue: () => ({
          prop: "",
          label: "",
          width: "",
          showOverflowTooltip: false,
          transform: "",
        }),
      },
    },
  ],
  submitApi: SaveDynamicFormViewComp,
  onClosed: () => tableMethods.reload(),
});
const [TableComp, tableMethods] = useTable<Recordable>({
  rowKey: "id",
  columns: [
    // { prop: 'id', label: 'id' },
    { prop: "name", label: "名称" },
    {
      prop: "dataSourceType",
      label: "数据源",
      formatter: (row, val) => {
        if (val === "DynamicTable") {
          return <el-tag>{row.dynamicTable.name}</el-tag>;
        } else {
          return `-`;
        }
      },
    },
    // {
    //     prop: 'dynamicTable', label: '轻代码数据表', formatter: (row, val) => {
    //         if (row.dataSourceType === 'DynamicTable') {
    //             return val.name
    //         } else {
    //             return `-`
    //         }
    //     }
    // },
    {
      prop: "formSourceType",
      label: "表单",
      formatter: (row, val) => {
        if (val === "DynamicForm") {
          return <el-tag>{row.dynamicForm.name}</el-tag>;
        } else {
          return `-`;
        }
      },
    },
    // {
    //     prop: 'dynamicForm', label: '轻代码表单', formatter: (row, val) => {
    //         if (row.formSourceType === 'DynamicForm') {
    //             return val.name
    //         } else {
    //             return `-`
    //         }
    //     }
    // },
    { prop: "createdAt", label: "创建时间" },
    { prop: "updatedAt", label: "编辑时间" },
  ],
  api: async (params, pageParams) => {
    return await GetDynamicFormViewComps(pageParams);
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
  title: "表单视图组件管理",
});
async function add() {
  dialogFormMethods.open({
    name: "",
    dataSourceType: "DynamicTable",
    formSourceType: "DynamicForm",
    tableColumns: [],
  });
}
async function edit(row) {
  const tableData = await GetDynamicFormViewComp(row.id);
  dialogFormMethods.open(omit(tableData, "createdAt", "updatedAt"));
}
async function del(row) {
  await DelDynamicFormViewComp(row.id);

  await tableMethods.reload();
}
</script>
