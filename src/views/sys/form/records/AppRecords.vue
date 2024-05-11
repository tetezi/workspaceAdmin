<template>
    <Records :tableId :columns :title :designer="AppDesigner"></Records>
</template>
<script lang="tsx" setup>
import Records from './Records.vue';
import { type TableColumn } from 'ttz-ui';
import AppDesigner from '../designer/AppDesigner.vue';
const tableId = '04295b7e-10ef-4226-b0ee-67b918db9aaf'
const title = `应用配置表`
const columns: TableColumn<Recordable>[] = [
    // { prop: 'Id', label: 'id' },
    { prop: 'No', label: '编号' },
    { prop: 'Name', label: '名称' },
]
</script>