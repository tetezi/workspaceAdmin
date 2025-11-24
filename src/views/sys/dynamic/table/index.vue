<template>
  <div style="height: 100%; box-sizing: border-box; padding: 8px">
    <TableComp style="padding: 8 16px"> </TableComp>
    <DialogFormComp> </DialogFormComp>
  </div>
</template>
<script lang="tsx" setup>
import {
  GetDynamicTables,
  GetDynamicTable,
  SaveDynamicTable,
  DelDynamicTable,
} from "@/api/sys/dynamic/table";
import { GetEnumCategorys } from "@/api/sys/enum";
import { useTable, BasicButton, useDialogForm } from "ttz-ui";
const [DialogFormComp, dialogFormMethods] = useDialogForm<any>({
  width: "95%",
  closeOnClickModal: false,
  labelPosition: "top",
  formSchemas: [
    { field: "name", label: "名称", component: "Input", colProps: { span: 6 } },
    {
      field: "tableName",
      label: "表名",
      component: "Input",
      colProps: { span: 6 },
    },

    {
      field: "cols",
      label: "字段",
      component: "EditableTable",
      componentStyle: {
        height: "500px",
      },
      componentProps: {
        height: 500,
        addBtnValue: () => ({ canQuery: true, canWritable: true }),
        columns: [
          {
            label: "字段名",
            prop: "name",
            editConfig: {
              component: "Input",
            },
            width: 200,
          },

          {
            label: "字段类型",
            prop: "colType",
            editConfig: ({ setRowFieldValue }) => ({
              component: "Select",
              componentProps: {
                options: [
                  { value: "String", label: "字符串" },
                  { value: "Boolean", label: "布尔" },
                  { value: "Int", label: "数字" },
                  { value: "DateTime", label: "日期时间" },
                  { value: "Enum", label: "枚举" },
                  { value: "SubTable", label: "子表" },
                ],
                onChange: (val) => {
                  if (val !== "SubTable") {
                    setRowFieldValue("fission", null);
                    setRowFieldValue("transform", null);
                    setRowFieldValue("subTableQueryStrategy", null);
                    setRowFieldValue("subTableWritableStrategy", null);
                    setRowFieldValue("subTableId", null);
                    setRowFieldValue("subTableType", null);
                  }
                  if (val !== "Enum") {
                    setRowFieldValue("enumCategoryId", null);
                  }
                },
              },
            }),
            width: 150,
          },
          {
            label: "可写入",
            prop: "canWritable",
            editConfig: {
              component: "Switch",
            },
            width: 80,
          },

          {
            label: "可查询",
            prop: "canQuery",
            editConfig: {
              component: "Switch",
            },
            width: 80,
          },
          {
            label: "转换",
            prop: "transform",
            hide: ({ row }) => {
              return !row.canQuery;
            },
            editConfig: {
              component: "Input",
              componentProps: {
                placeholder: `如：return (v)=>v;\n为空则不转换`,
              },
              //   component: "AceEditor",
              //   componentProps: {
              //     lang: "javascript",
              //     placeholder: `如：return (v)=>v;\n为空则不转换`,
              //   },
              //   componentStyle: {
              //     height: "90px",
              //   },
            },
            width: 300,
          },
          {
            label: "枚举类型",
            prop: "enumCategoryId",
            hide: ({ row }) => {
              return row.colType !== "Enum";
            },
            editConfig: {
              component: "ApiSelect",
              componentProps: {
                api: GetEnumCategorys,
                immediate: true,
                labelField: "title",
                valueField: "id",
                placeholder: "请选择枚举类型",
              },
            },
            width: 150,
          },
          {
            label: "子表类型",
            prop: "subTableType",
            hide: ({ row }) => {
              return row.colType !== "SubTable";
            },
            editConfig: {
              component: "Select",
              componentProps: {
                options: [
                  { value: "ToOne", label: "对一" },
                  { value: "ToMany", label: "对多" },
                ],
              },
            },
            width: 120,
          },
          /**
           *TODO 弹窗选择子表
           */
          {
            label: "子表选择",
            prop: "subTableId",
            hide: ({ row }) => {
              return row.colType !== "SubTable";
            },
            editConfig: {
              component: "ApiSelect",
              componentProps: {
                api: GetDynamicTables,
                labelField: "name",
                valueField: "id",
                placeholder: "请选择轻代码数据表",
                immediate: true,
              },
            },
          },
          {
            label: "子表写入策略",
            prop: "subTableWritableStrategy",
            hide: ({ row }) => {
              return row.colType !== "SubTable" || !row.canWritable;
            },
            editConfig: {
              component: "Select",
              componentProps: {
                options: [
                  { value: "ConnectById", label: "Id链接" },
                  { value: "UpsertByObject", label: "更新对象" },
                ],
              },
            },
            width: 120,
          },
          /**
           *TODO 部分对象时需要再加一个配置，配置对应查询的节选字段
           */
          {
            label: "子表查询策略",
            prop: "subTableQueryStrategy",
            hide: ({ row }) => {
              return row.colType !== "SubTable" || !row.canQuery;
            },
            editConfig: {
              component: "Select",
              componentProps: {
                options: [
                  { value: "PartialObject", label: "部分对象（开发中）" },
                  { value: "FullObject", label: "完整对象" },
                ],
              },
            },
            width: 150,
          },
          {
            label: "分裂",
            prop: "fission",
            hide: ({ row }) => {
              return !(
                row.canQuery &&
                (row.colType === "SubTable" || row.colType === "Enum")
              );
            },
            editConfig: {
              component: "AceEditor",
              componentProps: {
                lang: "json",
              },
              componentStyle: {
                height: "90px",
              },
            },
            width: 300,
          },
        ],
      },
    },
  ],
  submitApi: async (formData) => {
    console.log(formData.cols);
    return SaveDynamicTable({
      ...formData,
      cols: formData.cols.map((col) => {
        return {
          ...col,
          fission: col.fission ? JSON.parse(col.fission) : null,
        };
      }),
    });
  },
  onClosed: () => tableMethods.reload(),
});
const [TableComp, tableMethods] = useTable<Recordable>({
  rowKey: "id",
  columns: [
    // { prop: 'id', label: 'id' },
    { prop: "name", label: "名称" },
    { prop: "tableName", label: "表名" },
    {
      prop: "cols",
      label: "字段",
      formatter: (_row, cols) => {
        return (
          <div>
            {(cols || []).map((col) => {
              return (
                <el-tag
                  type={col.colType === "SubTable" ? "danger" : "primary"}
                >
                  {col.name}
                </el-tag>
              );
            })}
          </div>
        );
      },
    },
    { prop: "createdAt", label: "创建时间" },
    { prop: "updatedAt", label: "编辑时间" },
  ],
  api: async (params, pageParams) => {
    return await GetDynamicTables(pageParams);
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
  title: "数据表管理",
});
async function add() {
  dialogFormMethods.open({
    name: "",
    tableName: "",
    cols: [
      {
        canQuery: true,
        canWritable: false,
        name: "createdAt",
        colType: "DateTime",
      },
      {
        canQuery: true,
        canWritable: false,
        name: "updatedAt",
        colType: "DateTime",
      },
    ],
  });
}
async function edit(row) {
  const tableData = await GetDynamicTable(row.id);
  dialogFormMethods.open({
    ...tableData,
    cols: tableData.cols.map((col) => {
      return {
        ...col,
        fission: col.fission ? JSON.stringify(col.fission, null, 2) : null,
      };
    }),
  });
}
async function del(row) {
  await DelDynamicTable(row.id);

  await tableMethods.reload();
}
</script>
