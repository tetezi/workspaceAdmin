<template>
    <DynamicFormDialogComp ref="DynamicFormCompRef" v-if="props.formSourceType === 'DynamicForm'" :title :dynamicFormId
        :extraRenderParams="{ viewCompMethods: props.viewCompMethods }" :submitFunc>
    </DynamicFormDialogComp>
</template>
<script lang="tsx" setup>
import { ref, unref, } from 'vue';
import DynamicFormDialogComp from '@/components/DynamicFormDialog/DynamicFormDialog.vue';
const props = defineProps<{
    title: string,
    formSourceType: 'DynamicForm',
    dynamicFormId?: UUID,
    submitFunc: (data: Recordable) => Promise<any>,
    viewCompMethods: Recordable<Function>
}>()
const DynamicFormCompRef = ref()
defineExpose({
    open: (data) => unref(DynamicFormCompRef).open(data),
    close: () => unref(DynamicFormCompRef).close(),
})
</script>