import type { CSSProperties } from "vue";
import type { JavaScriptCode } from "./base";
export type DynamicFormSchema = {
  /**
   * 组件类别    容器|输入|展示
   */
  category: "Container" | "Input" | "Display";
  /**
   * 组件
   */
  component?: string;
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
  id: string;
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
  label?: JavaScriptCode<string>;
};
export type FormRenderProps = {
  /**
   * 表单名
   */
  name: string;
  /**
   * 生命周期钩子
   */
  hooks: {
    /**
     * 控件挂载完成
     */
    mountAfter?: string;
    /**
     * 编辑数据回显前（返回值修改回显数据，reject将不设置回显值）
     */
    setEditValueBefore?: string;
    /**
     * 编辑数据回显后
     */
    setEditValueAfter?: string;
    /**
     * 保存数据前（返回值修改保存数据，reject将不调用保存接口）
     */
    saveBefore?: string;
    /**
     * 保存数据后
     */
    saveAfter?: string;
  };
  /**
   * 提交配置
   */
  submitApi:
    | {
        /**
         * 关联的数据表记录编号
         */
        linkDataRecordNo: string;
      }
    | {
        /**
         * 自定义提交地址
         */
        customSubmitUrl: string;
      };
  formSchemas: Array<DynamicFormSchema>;
};
export type FormRenderShortEvent = {};
