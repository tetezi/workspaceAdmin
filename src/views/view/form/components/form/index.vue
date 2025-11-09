<!--
 * @Author: tetezi MaHouShouJoTetezi@foxmail.com
 * @Date: 2024-09-05 14:52:03
 * @LastEditors: tetezi MaHouShouJoTetezi@foxmail.com
 * @LastEditTime: 2025-11-09 17:36:02
 * @FilePath: \workspaceAdmin\src\views\view\form\components\form\index.vue
 * @Description: 
-->
<template>
  <DynamicFormDialogComp
    ref="DynamicFormCompRef"
    v-if="props.formSourceType === 'DynamicForm'"
    :title
    :dynamicFormId
    :extraRenderParams="{ viewCompMethods: props.viewCompMethods }"
    :submitFunc
  >
  </DynamicFormDialogComp>
</template>
<script lang="tsx" setup>
import { ref, unref } from "vue";
import DynamicFormDialogComp from "@/components/DynamicFormDialog/DynamicFormDialog.vue";
const props = defineProps<{
  title: string;
  formSourceType: "DynamicForm";
  dynamicFormId?: UUID;
  submitFunc: (data: Recordable) => Promise<any>;
  viewCompMethods: Recordable<Function>;
}>();
const DynamicFormCompRef = ref();
defineExpose({
  open: (data) => unref(DynamicFormCompRef).open(data),
  close: () => unref(DynamicFormCompRef).close(),
});
</script>
