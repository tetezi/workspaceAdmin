<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <el-card style="margin: 10px">
      <div>
        <FormComp />

        <BasicButton
          v-if="isOk"
          :type="isCompleteMD ? undefined : 'primary'"
          :func="generateMd"
          >生成文档</BasicButton
        >
        <BasicButton
          v-if="isOk"
          :type="isCompleteMD ? 'primary' : undefined"
          :disabled="!isCompleteMD"
          :func="generateJSON"
          >生成json</BasicButton
        >
      </div>
    </el-card>

    <el-card style="margin: 10px; flex: 1; overflow: auto">
      <MarkdownRender v-model="textOfMD" style="height: 100%"></MarkdownRender>
    </el-card>

    <el-card style="margin: 10px; flex: 1">
      <AceEditor
        v-model="showTextOfJSON"
        lang="json"
        style="height: 100%"
      ></AceEditor>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { useEventSource } from "@/hooks/useEventSource";
import { message } from "@/utils/message";
import { useForm, BasicButton } from "ttz-ui";
import { computed, ref, unref } from "vue";
import MarkdownRender from "@/components/MarkdownRender/index.vue";
import { AceEditor } from "ttz-ui";
const textOfMD = ref("");
const isCompleteMD = ref(false);
const textOfJSON = ref("");
const isCompleteJSON = ref(false);
const showTextOfJSON = computed({
  get: () => {
    let r = unref(textOfJSON);
    try {
      r = JSON.stringify(JSON.parse(unref(textOfJSON)), null, 2);
    } catch (err) {}
    return r;
  },
  set: (v) => {
    console.log(v);
    // textOfJSON.value = v;
  },
});
const [FormComp, formMethod, isOk] = useForm({
  formSchemas: [
    {
      component: "Input",
      field: "prompt",
      label: "文本",
      labelShow: false,
      componentProps: { placeholder: "请输入" },
    },
  ],
  defaultValue: {
    prompt: "帮我写一个员工加班申请的页面",
  },
});
async function generateMd() {
  isCompleteMD.value = false;
  textOfMD.value = "";
  await formMethod.validate();
  const { prompt } = unref(formMethod.getModelValue);
  const { promise } = useEventSource({
    url: `http://192.168.10.93:3000/openAI/dynamicFormGenerateMDTest?prompt=${encodeURIComponent(prompt)}`,
    onMessage: (data) => {
      const { code, content } = data as any;
      if (code === "DATA") {
        textOfMD.value += content;
      }
    },
    onSuccess: () => {
      console.log(textOfMD.value);
      isCompleteMD.value = true;
    },
    onErr: () => {
      message("接口请求失败", "error");
    },
  });
  return promise;
}

async function generateJSON() {
  isCompleteJSON.value = false;
  const { promise } = useEventSource({
    url: `http://192.168.10.93:3000/openAI/dynamicFormGenerateJSONTest?prompt=${encodeURIComponent(unref(textOfMD))}`,
    onMessage: (data) => {
      const { code, content } = data as any;
      if (code === "DATA") {
        textOfJSON.value += content;
      }
    },
    onSuccess: () => {
      console.log(textOfJSON.value);
      isCompleteJSON.value = true;
    },
    onErr: () => {
      message("接口请求失败", "error");
    },
  });
  return promise;
}
</script>
