<template>
    <TableComp></TableComp>
</template>
<script lang="ts" setup>
import { useTable } from 'ttz-ui';

const [TableComp] = useTable({
    columns: [
        { prop: 'Id', label: 'Id' },
        { prop: 'TableName', label: 'TableName' },
        { prop: 'Name', label: 'Name' },
        { prop: 'No', label: 'No' },
        { prop: 'Id', label: 'Id' },
    ]
})
</script>