<template>
    <Designer ref="designerRef" :id="props.id" :tableId :formProps></Designer>
</template>
<script lang="ts" setup>
import { pick } from 'lodash';
import Designer from './Designer.vue';
import type { FormBind } from 'ttz-ui';
import { markRaw, ref, unref } from 'vue';
import EasyApiSelect from '@/components/EasyApiSelect/EasyApiSelect.vue';
const tableId = '193fc4e9-6956-4578-8cbf-46549c842484'
const props = defineProps<{
    id?: UUID
}>()
const designerRef = ref()
const formProps: FormBind = {
    defaultValue: { Cols: [] },
    formSchemas: ([
        {
            field: 'No', label: '编号', component: 'Input', ifShow: Boolean(props.id), componentProps: {
                disabled: true
            }
        },
        { field: 'Name', label: '名称', component: 'Input' },
        {
            field: 'AppId', label: 'AppId', component: () => (EasyApiSelect), componentProps: {
                configLabel: 'Init_应用列表', valueField: 'Id', labelField: 'Name', initAutoSelectFirst: true, immediate: true
            }
        },
    ]),
    beforeSubmit: (raw) => {
        return {
            ...pick(raw, ['Name', 'AppId']),
        }
    },
}
defineExpose({
    submit: () => unref(designerRef).submit()
})
</script>