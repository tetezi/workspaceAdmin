import {
  type Action,
  ElMessage,
  ElMessageBox,
  type ElMessageBoxOptions,
  type MessageBoxState,
} from "element-plus";
import { isFunction, isNumber, isObject, isString, omit } from "lodash";
import { buildUUID } from "./uuid";
/** 消息提示
 * @param msg 字符串或带有message字段的对象
 * @param type 提示类型
 * @param option el提示框配置
 * @returns
 */
export function message(
  msg:
    | string
    | ({
        title?: string;
        message: string;
      } & Recordable),
  type: "success" | "warning" | "info" | "error" = "info",
  option: Recordable = {}
) {
  let message;
  type === "error" && console.error(`以下为错误信息`);
  if (isString(msg)) {
    message = msg;
    console.table({ [type]: { message } });
  } else if (isObject(msg)) {
    message = msg.message;
    console.table({ [msg.title || 0]: omit(msg, ["title"]) });
  } else {
    message = msg;
  }
  return ElMessage({
    message,
    type,
    showClose: true,
    grouping: true,
    ...option,
  });
}
/** 确认弹窗
 *
 * @param message  确认弹窗内容，传入vnode或字符串
 * @param options el确认弹窗配置
 * @param checkFunc 确认按钮检查异步方法
 * @returns
 */
export async function messageBoxConfirm(
  content: ElMessageBoxOptions["message"],
  options: ElMessageBoxOptions & {
    width?: string | number;
    needBodyLoading?: boolean;
  } = {},
  checkFunc?: () => Promise<any>
) {
  // const bodyLoadingRef = ref(false);
  const customStyle =
    options.customStyle || options.width
      ? {
          width: isNumber(options.width) ? `${options.width}px` : options.width,
          maxWidth: "none",
          ...(options.customStyle || {}),
        }
      : undefined;
  return ElMessageBox.confirm(
    () => {
      return (
        <div /* v-loading={options.needBodyLoading && unref(bodyLoadingRef)}  */
        >
          {isFunction(content) ? content() : content}
        </div>
      );
    },
    {
      beforeClose: async (
        action: Action,
        instance: MessageBoxState,
        done: () => void
      ) => {
        if (action === "confirm") {
          if (isFunction(checkFunc)) {
            instance.confirmButtonLoading = true;
            // bodyLoadingRef.value = true;
            await checkFunc().finally(() => {
              // bodyLoadingRef.value = false;
              instance.confirmButtonLoading = false;
            });
          }
        }
        done();
      },
      closeOnClickModal: false,
      draggable: true,
      ...options,
      customStyle,
    }
  );
}

export async function messageBox(
  message:
    | ElMessageBoxOptions["message"]
    | ((action: { close: () => void }) => ElMessageBoxOptions["message"]),
  options: ElMessageBoxOptions & { width?: string | number } = {}
): Promise<void> {
  const customStyle =
    options.customStyle || options.width
      ? {
          width: isNumber(options.width) ? `${options.width}px` : options.width,
          maxWidth: "none",
          ...(options.customStyle || {}),
        }
      : undefined;
  return new Promise<void>((resolve) => {
    const customClass = "ElMessageBox_" + buildUUID();
    ElMessageBox({
      message: isFunction(message)
        ? message({
            close: () => {
              const element: any = document.querySelector(
                `.${customClass} .el-message-box__headerbtn`
              );
              element?.click?.();
            },
          })
        : message,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      draggable: true,
      title: "",
      showConfirmButton: false,
      callback: () => {
        resolve();
      },
      ...options,
      customStyle,
      customClass,
    });
  });
}
