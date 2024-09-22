import type { CSSProperties, VNodeChild } from "vue";
import type { ColProps as ElColProps } from "element-plus";
type JavaScriptCode<T> =
  | { type: "code"; code?: string }
  | { type: "value"; value?: T }
  | string;
export type DynamicFormSchemaType = {
  /**
   * 组件类别    容器|输入|展示
   */
  category: "Container" | "Input" | "Display";
  /**
   * 列的名称，仅用于配置时展示树形，不参与表单实际构造
   */
  name: string;
  /**
   * 组件
   */
  component: string;
  /**
   * 组件Props
   */
  componentProps?: JavaScriptCode<Recordable>;
  /**
   * 组件样式
   */
  componentStyle?: JavaScriptCode<CSSProperties>;
  /**
   * 配置主键
   */
  schemaKey: string;
  /**
   * 是否显示
   */
  ifShow?: JavaScriptCode<boolean>;
  /**
   * 映射字段（英文，可通过.映射深层属性，如：a.b，但请确保a已声明而非“a is not defined”）
   */
  field?: string;
  /**
   * 对应字段名称（中文）
   */
  label?: string;
  /**
   * 对应字段名称显示
   */
  labelShow?: JavaScriptCode<boolean>;
  /**
   * 对应字段名称渲染函数
   */
  labelRender?: JavaScriptCode<VNodeChild>;
  /**
   * 对应字段名称宽度
   */
  labelWidth?: JavaScriptCode<string>;
  /**
   * 子组件
   */
  children?: DynamicFormSchemaType[];
  /**
   * 渲染函数
   */
  render?: JavaScriptCode<VNodeChild>;
  /**
   * 组件渲染函数
   */
  componentRender?: JavaScriptCode<VNodeChild>;
  /**
   * 组件插槽
   */
  componentSlot?: JavaScriptCode<Recordable<() => VNodeChild>>;
  /**
   * 声明该属性将嵌套el-col，为false时表示不嵌套el-col
   */
  colProps?: Partial<ElColProps> | false;
};

export type DynamicFormType = {
  id: UUID;
  name: string;
  beforeSubmit?: string;
  defaultValue?: string;
  schemas: DynamicFormSchemaType[];
  description?: string;
};
