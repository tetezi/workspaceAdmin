<template>
  <div>
    <Collapse
      v-for="group in preinstall"
      :title="group.title"
      :key="group.name"
    >
      <div style="display: flex; flex-wrap: wrap">
        <template v-for="item in group.list" :key="item.name">
          <BasicButton
            v-if="filterFunc(item)"
            :func="() => onSelectItem(item)"
            :type="
              item.category === 'Input'
                ? 'primary'
                : item.category === 'Container'
                  ? 'success'
                  : 'info'
            "
            style="margin: 5px"
          >
            {{ item.name }}
          </BasicButton>
        </template>
      </div>
    </Collapse>
  </div>
</template>
<script lang="ts" setup>
import { cloneDeep, omit } from "lodash";
import { buildUUID } from "@/utils/uuid";
import { BasicButton, Collapse } from "ttz-ui";
import type { DynamicFormSchemaType } from "@/components/DynamicFormDialog/types";
const props = defineProps<{
  filter: {
    category: string[];
    q: string;
  };
}>();
function filterFunc(item) {
  return (
    props.filter.category.includes(item.category) &&
    (props.filter.q === "" || item.name.includes(props.filter.q))
  );
}
const emit = defineEmits<{
  selectPreinstall: [config: DynamicFormSchemaType];
}>();
const preinstall = [
  {
    title: "基础组件",
    name: "0",
    list: [
      {
        name: "文本输入框",
        component: "Input",
        category: "Input",
      },
      {
        name: "多行文本输入框",
        component: "Input",
        category: "Input",
        componentProps: `return {\n\ttype: 'textarea'\n}`,
      },
      {
        name: "数字输入框",
        component: "InputNumber",
        category: "Input",
      },
      {
        name: "单选框",
        component: "Radio",
        category: "Input",
        componentProps: `return {\noptions:[\n{label:'选项一',value:'1'},\n{label:'选项二',value:'2'}\n]\n}`,
      },
      {
        name: "下拉框",
        component: "Select",
        category: "Input",
        componentProps: `return {\noptions:[\n{label:'选项一',value:'1'},\n{label:'选项二',value:'2'}\n]\n}`,
      },
      {
        name: "滑块",
        component: "Slider",
        category: "Input",
      },
      {
        name: "开关",
        component: "Switch",
        category: "Input",
      },
      {
        name: "日期选择器",
        component: "DatePicker",
        category: "Input",
      },
      {
        name: "卡片",
        component: "Card",
        category: "Container",
        componentProps: `return {
    title:'标题'
}`,
        children: [],
      },
      {
        name: "折叠栏",
        component: "Collapse",
        category: "Container",
        componentProps: `return {
    title:'标题',
    //默认展开
    //defaultValue:true,
    //未显示依然渲染
    //forceRender:true,
}`,
        children: [],
      },
      {
        name: "按钮",
        component: "BasicButton",
        category: "Display",
        componentProps: `return  {
    label: '按钮',
    //可支持异步操作
    func: () => {
        console.log('点击了按钮')
    }
}`,
      },
      {
        name: "分割线",
        component: "Divider",
        category: "Display",
        componentProps: `return  {
    //title: '按钮',
    //direction: "horizontal",
    //borderStyle: 'solid',
    //contentPosition: 'center', 
    }
}`,
      },
    ],
  },
  {
    title: "高级组件",
    name: "1",
    list: [
      {
        name: "异步下拉框",
        component: "ApiSelect",
        category: "Input",
        componentProps: `return {
    //请求方法
    api: async (params) => {
        console.log('发起请求', params)
        return []
    },
    //请求参数函数
    params: () => {
        //绑定表单值，可取其他值为依赖动态修改参数并触发请求
        const { formValue } = renderParams
        return {
            user: formValue.user
        }
    }
}`,
      },
      {
        name: "异步枚举下拉框1",
        component: "ApiSelect",
        category: "Input",
        componentProps: `    return { 
        api: async (params) => {
            const CategoryName = ''
            return ( await renderParams.apiMethods.getEnumCategory(CategoryName)).details
        },
        labelField: 'name',
        valueField: 'value',
    }`,
      },
      {
        name: "异步枚举下拉框2",
        component: "EnumSelect",
        category: "Input",
        componentProps: `    return { 
        categoryName: '',
    }`,
      },
      {
        name: "行内编辑",
        component: "EditableTable",
        category: "Input",
        componentProps: `return { 
    columns: [
        { prop: 'title', label: '标题' },
        { prop: 'name' , label: '姓名', editConfig: {
                component:'Input'
            }
        }
    ],
    rowKey: 'id', 
    addBtnValue:{ title: '测试1'}, 
}`,
      },
      {
        name: "表格穿梭选择",
        component: "TableTransfer",
        category: "Input",
        componentProps: `return {
    title: () => '请勾选后转移至右侧',
    columns: [{ prop: 'title', label: '标题' }],
    rowKey: 'id',
    //本地固定可选项
    unSelectedData: [{ id: 'asd' }, { id: 'www' }, { id: 'f' }],
    //也通过api请求可选项
    api: () => { },
    params: () => { }
}`,
      },
    ],
  },
  {
    title: "业务级组件",
    name: "2",
    list: [
      {
        name: "员工",
        component: "ApiSelect",
        category: "Input",
        componentProps: `    return {
        labelField: 'name',
        valueField: 'id',
        isObject: true,
        immediate: true,
        placeholder: '请选择员工',
        api: async (params) => {
            return await renderParams.apiMethods.baseGet({
                url: '/user/getAllUsers',
            })
        },
    }`,
      },
    ],
  },
];
function onSelectItem(raw) {
  const data = cloneDeep(raw);
  function getCloneConfig(config): DynamicFormSchemaType {
    const schemaKey = buildUUID();
    const displayConfig = config.category === "Display" ? {} : undefined;
    const containerConfig =
      config.category === "Container"
        ? {
            children: (config.children || []).map(getCloneConfig),
          }
        : undefined;
    const inputConfig =
      config.category === "Input"
        ? ({
            field: `${schemaKey}`,
            label: config.name,
            labelShow: {
              type: "value",
              value: true,
            },
            labelWidth: undefined,
            labelRender: undefined,
          } as const)
        : undefined;
    return {
      /**
       * 组件类别    容器|输入|展示
       */
      category: config.category,
      /**
       * 列的名称，仅用于配置时展示树形，不参与表单实际构造
       */
      name: config.name,
      /**
       * 组件
       */
      component: config.component,
      /**
       * 组件Props
       */
      componentProps: config.componentProps,
      /**
       * 组件样式
       */
      componentStyle: config.componentStyle,
      /**
       * 组件渲染
       */
      componentRender: config.componentRender,
      /**
       * 配置主键
       */
      schemaKey,
      /**
       * 是否显示
       */
      ifShow: config.ifShow,
      render: config.render,
      componentSlot: config.componentSlot,
      colProps: config.colProps,
      ...inputConfig,
      ...containerConfig,
      ...displayConfig,
    };
  }
  const config = getCloneConfig(data);
  emit("selectPreinstall", config);
}
</script>
