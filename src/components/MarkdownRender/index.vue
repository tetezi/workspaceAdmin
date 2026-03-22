<template>
  <div class="md-viewer">
    <BasicButton :func="changeEidtMode" type="primary">
      {{ isEdit ? "预览模式" : "编辑模式" }}
    </BasicButton>
    <el-input
      v-if="isEdit"
      class="md-edit"
      type="textarea"
      v-model="modelValue"
      style="flex: 1"
    ></el-input>
    <div class="md-render" v-else>
      <div v-html="renderedHtml"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, unref, watchEffect } from "vue";
import { marked } from "marked";
import { BasicButton } from "ttz-ui";
defineOptions({
  name: "MarkdownRender",
});
const modelValue = defineModel();
const isEdit = ref(false);
const renderedHtml = ref("");
function changeEidtMode() {
  isEdit.value = !isEdit.value;
}
watchEffect(() => {
  renderedHtml.value = marked.parse(unref(modelValue) ?? "");
});
</script>

<style lang="less" scoped>
/* 基础样式：避免 MD 内容排版混乱 */
.md-viewer {
  box-sizing: border-box;
  padding: 16px;
  line-height: 1.8;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  .md-render {
    flex: 1;
    overflow: auto;
    :deep(table) {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
      th,
      td {
        border: 1px solid #e6e6e6;
        padding: 8px 12px;
        text-align: left;
      }
      th {
        background-color: #f5f5f5;
      }
    }

    :deep(h1) {
      font-size: 20px;
      color: #303133;
    }
    :deep(h2) {
      font-size: 18px;
      color: #404040;
      border-bottom: 1px solid #e6e6e6;
      padding-bottom: 8px;
      margin: 16px 0;
    }
  }
  .md-edit {
    flex: 1;
    :deep(.el-textarea__inner) {
      height: 100%;
    }
  }
}
</style>
