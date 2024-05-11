<template>
    <Designer :id="props.id" :tableId :formProps></Designer>
</template>
<script lang="ts" setup>
import { pick } from 'lodash';
import Designer from './Designer.vue';
import type { FormBind } from 'ttz-ui';
const tableId = ``
const props = defineProps<{
    id?: UUID
}>()
const formProps: FormBind = {
    defaultValue: {},
    formSchemas: [
        { field: 'name', label: 'name', component: 'Input' },
        { field: 'url', label: 'url', component: 'Input' },
        { field: 'sort', label: 'sort', component: 'InputNumber' },
        { field: 'parentId', label: 'parentId', component: 'Input' },
        { field: 'urlLabel', label: 'urlLabel', component: 'Input' },
        { field: 'type', label: 'type', component: 'Input' },
        { field: 'param', label: 'param', component: 'Input' },

    ],
    beforeSubmit: (raw) => {
        return {
            ...pick(raw, ['name', 'url', 'sort', 'parentId', 'urlLabel', 'type', 'param']),
        }
    },
}
</script>