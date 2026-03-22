import { onBeforeUnmount, ref, unref, type Ref } from "vue";
function useManualPromise<T = void>() {
  let resolvePromise;
  let rejectPromise;
  const manualPromise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return {
    promise: manualPromise,
    resolve: resolvePromise,
    reject: rejectPromise,
  };
}
export function useEventSource<Message>({
  url,
  onMessage,
  onErr,
  onSuccess,
}: {
  url: string;
  onMessage?: (message: Message) => void;
  onSuccess?: (messageList: Message[]) => void;
  onErr?: (messageList: Message[], err: unknown) => void;
}) {
  const listRef: Ref<Message[]> = ref([]);
  let eventSource: null | EventSource = null;
  const { promise, resolve, reject } = useManualPromise();
  function init() {
    eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        // 后端约定的结束标识
        closeSSE(true); // 接收完成，关闭连接
        return;
      }
      const data = JSON.parse(event.data);
      listRef.value.push(data);
      onMessage?.(data);
    };
    eventSource.onopen = () => {
      console.log("SSE 连接已打开");
    };
    eventSource.onerror = (err) => {
      console.error("SSE 错误:", err);
      // 连接异常时自动关闭
      closeSSE(false, err);
    };
  }
  function closeSSE(isSuccess = false, err?: unknown) {
    if (isSuccess) {
      onSuccess?.(unref(listRef));
      resolve();
    } else {
      onErr?.(unref(listRef), err);
      reject();
    }
    if (eventSource) {
      eventSource.close(); // 关闭连接
      eventSource = null; // 清空实例
      console.log("SSE 连接已关闭");
    }
  }
  init();

  onBeforeUnmount(() => {
    closeSSE(false);
  });
  return { eventSource, listRef, promise };
}
