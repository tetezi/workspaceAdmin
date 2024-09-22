<template>
    <DynamicFormDialogComp title="预览" :submitFunc :extraRenderParams :dynamicForm="dynamicFormRef" ref="DynamicFormRef">
    </DynamicFormDialogComp>
</template>
<script lang="ts" setup>
import DynamicFormDialogComp from '@/components/DynamicFormDialog/DynamicFormDialog.vue'
import type { DynamicFormType } from '@/components/DynamicFormDialog/types';
import { nextTick, ref, unref } from 'vue';
const DynamicFormRef = ref<InstanceType<typeof DynamicFormDialogComp>>()
async function submitFunc(data) {
    console.log(data)
    return Promise.reject('预览')
}
const extraRenderParams = {
    viewCompMethods: {}
}
const dynamicFormRef = ref<DynamicFormType>()
defineExpose({
    open: async (dynamicForm: DynamicFormType) => {
        (dynamicFormRef).value = dynamicForm
        await nextTick()
        return unref(DynamicFormRef)?.open({})
    }
})
</script>