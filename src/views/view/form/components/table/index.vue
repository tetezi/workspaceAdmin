<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-05 11:03:21
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-11-09 15:19:41
 * @FilePath: \workspaceAdmin\src\views\view\form\components\table\index.vue
 * @Description: 
 * 
-->
<template>
  <TableComp style="padding: 8 16px"> </TableComp>
</template>
<script lang="tsx" setup>
import {
  DelDynamicTableRecored,
  GetDynamicTableRecored,
  GetDynamicTableRecoreds,
  SaveDynamicTableRecored,
} from "@/api/sys/dynamic/tableRecored";
import { unKnownHttp } from "@/utils/http";
import { message } from "@/utils/message";
import { BasicButton, useTable } from "ttz-ui";
import { h } from "vue";
const props = defineProps<{
  title: string;
  /**
   * TODO:需要处理其他数据源格式
   */
  dataSourceType: "DynamicTable";
  dynamicTableId?: UUID;
  dynamicThirdPartyTable: {
    addUrl: string;
    delUrl: string;
    editUrl: string;
    getDetailUrl: string;
    getListUrl: string;
  };
  columns: Recordable[];
  add: () => void;
  edit: (row: Recordable) => void;
  del: (row: Recordable) => void;
}>();
async function unKnownFetch(url, params, type: "get" | "post" = "get") {
  if (!url) {
    message("未配置第三方数据源url", "error");
    return Promise.reject("未配置第三方数据源url");
  }
  // const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYzRiYzU5NS1mNzUyLTRlNzQtOWIxZS1jYTI5MzJiYzFiOWMiLCJpYXQiOjE3NzE5MzA1OTksImV4cCI6MTc3MTkzMTQ5OX0.Vp4Y8jqT-Ozfqtk8Y4nWvAHt-9gpJ3e6u23qUPl0kt8`;
  const { data } = await unKnownHttp[type](
    {
      url: url,
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    },
    params,
    {
      withToken: false,
      errorHandler: (err) => {
        message(
          {
            title: "接口请求失败",
            url,
            message: err.response.data.message,
            err,
          },
          "error",
        );
        return err;
      },
    },
  );
  return data;
}
const [TableComp, tableMethods] = useTable(() => ({
  title: props.title,
  api: async (params, pageParams) => {
    if (props.dataSourceType === "DynamicTable") {
      return await GetDynamicTableRecoreds(
        {
          tableId: props.dynamicTableId!,
        },
        pageParams,
      );
    } else if (props.dataSourceType === "DynamicThirdPartyTable") {
      return unKnownFetch(props.dynamicThirdPartyTable.getListUrl, params);
    } else {
      /**
       * TODO:需要处理其他数据源格式
       */
    }
  },
  columns: () => {
    return (props.columns || []).map((column) => {
      console.log(111, column, column.transform);
      return {
        prop: column.prop,
        label: column.label,
        showOverflowTooltip: column.showOverflowTooltip,
        width: column.width,
        formatter: column.transform
          ? (row) => {
              // column.transform
              /**
               * 需要处理转换函数
               */
              try {
                const transform = new Function(column.transform)();
                return transform(row[column.prop], row, h);
              } catch (error) {
                console.error(
                  `JSCode运行异常:${(error as ReferenceError).message}`,
                  {
                    rawError: error,
                    code: column.transform,
                    configKey: `${column}.transform`,
                  },
                );
                return row[column.prop];
              }
            }
          : undefined,
      };
    });
  },
  actionColumn: (row) => {
    return (
      <div>
        <BasicButton func={() => props.edit(row)}>编辑</BasicButton>
        <BasicButton func={() => props.del(row)} isConfirm type="danger">
          删除
        </BasicButton>
      </div>
    );
  },
  headerActionRender: () => (
    <BasicButton func={() => props.add()} type="primary">
      新增
    </BasicButton>
  ),
}));
defineExpose({
  saveRecored: async (data) => {
    if (props.dataSourceType === "DynamicTable") {
      return await SaveDynamicTableRecored(props.dynamicTableId!, data);
    } else if (props.dataSourceType === "DynamicThirdPartyTable") {
      /**
       * TODO:需要处理其他数据源格式
       */
      return await unKnownFetch(
        props.dynamicThirdPartyTable.editUrl,
        data,
        "post",
      );
    }
  },
  getRecored: async (id) => {
    if (props.dataSourceType === "DynamicTable") {
      return await GetDynamicTableRecored(props.dynamicTableId!, id);
    } else if (props.dataSourceType === "DynamicThirdPartyTable") {
      return await unKnownFetch(props.dynamicThirdPartyTable.editUrl, { id });
    }
  },
  delRecored: async (id) => {
    if (props.dataSourceType === "DynamicTable") {
      return await DelDynamicTableRecored(props.dynamicTableId!, id);
    } else if (props.dataSourceType === "DynamicThirdPartyTable") {
      return await unKnownFetch(
        props.dynamicThirdPartyTable.editUrl,
        { id },
        "post",
      );
    }
  },
  reload: async () => {
    return tableMethods.reload();
  },
});
</script>
