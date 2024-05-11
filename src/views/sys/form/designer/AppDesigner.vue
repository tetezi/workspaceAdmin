<template>
    <Designer ref="designerRef" :id="props.id" :tableId :formProps></Designer>
</template>
<script lang="ts" setup>
import { pick } from 'lodash';
import Designer from './Designer.vue';
import type { FormBind } from 'ttz-ui';
import { ref, unref } from 'vue';
const tableId = '04295b7e-10ef-4226-b0ee-67b918db9aaf'
const props = defineProps<{
    id?: UUID
}>()
const designerRef = ref()
const formProps: FormBind = {
    defaultValue: { Cols: [] },
    formSchemas: [
        {
            field: 'No', label: '编号', component: 'Input', ifShow: Boolean(props.id), componentProps: {
                disabled: true
            }
        },
        { field: 'Name', label: '名称', component: 'Input' },
    ],
    beforeSubmit: (raw) => {
        return {
            ...pick(raw, ['Name']),
        }
    },
}
defineExpose({
    submit: () => unref(designerRef).submit()
})
</script>