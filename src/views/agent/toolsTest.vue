<template>
  <div>
    <el-card style="margin: 10px">
      <FormComp />
      <div v-if="tools.length > 0">
        调用函数：
        <BasicButton
          v-for="tool of tools"
          :key="tool.name"
          :loading="tool.loading"
          :tip="tool.res"
          color="#667891"
          style="margin: 0 10px"
          >{{ tool.name }}</BasicButton
        >
      </div>
      <!-- <MarkdownRender v-model="text"></MarkdownRender> -->
    </el-card>
    <el-card style="margin: 10px" v-show="text.length > 0">{{ text }}</el-card>
  </div>
</template>
<script lang="ts" setup>
import { useEventSource } from "@/hooks/useEventSource";
import { message } from "@/utils/message";
import { useForm, BasicButton } from "ttz-ui";
import { ref, unref } from "vue";
import MarkdownRender from "@/components/MarkdownRender/index.vue";
const text = ref("");
const [FormComp, formMethod, isOk] = useForm({
  formSchemas: [
    {
      colProps: { span: 24 },
      component: "Input",
      field: "prompt",
      labelShow: false,
      label: "文本",
      componentProps: { placeholder: "请输入" },
    },
    {
      colProps: { span: 6 },
      category: "Display",
      component: "BasicButton",
      componentProps: {
        func: submitBtnFuc,
        label: "提交",
        type: "primary",
      },
    },
  ],
  defaultValue: {
    prompt: "请告诉我上海的天气",
  },
});
const tools = ref<any[]>([]);
async function submitBtnFuc() {
  tools.value = [];
  text.value = "";
  await formMethod.validate();
  const { prompt } = unref(formMethod.getModelValue);
  const { promise } = useEventSource({
    url: `http://192.168.10.93:3000/openAI/toolsTest?prompt=${encodeURIComponent(prompt)}`,
    onMessage: (data: any) => {
      const { code, content } = data as any;
      if (code === "DATA") {
        text.value += content;
      } else if (code === "TOOL_START") {
        tools.value.push({
          name: data.name,
          loading: true,
          res: "",
        });
      } else if (code === "TOOL_END") {
        console.log(222, tools.value, data);
        const tool = unref(tools).find(({ name }) => {
          return name === data.name;
        });
        tool.loading = false;
        tool.res = data.content;
      }
    },
    onErr: () => {
      message("接口请求失败", "error");
    },
    onSuccess: (r) => {},
  });
  return promise;
}
</script>
