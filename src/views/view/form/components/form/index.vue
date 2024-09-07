<template>
    <DynamicFormComp ref="DynamicFormCompRef" v-if="props.formSourceType === 'DynamicForm'" :title :dynamicFormId
        :viewCompMethods :submitFunc>
    </DynamicFormComp>
</template>
<script lang="tsx" setup>
import { ref, unref, } from 'vue';
import DynamicFormComp from './DynamicForm.vue';
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