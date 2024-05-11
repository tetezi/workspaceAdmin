<template>
    <Records :tableId :columns :title :designer="SqlDesigner"></Records>
</template>
<script lang="tsx" setup>
import Records from './Records.vue';
import { type TableColumn } from 'ttz-ui';
import SqlDesigner from '../designer/SqlDesigner.vue';
const tableId = `d1d0924b-c262-4989-ab40-65b28c539bf2`
const title = 'SQL配置表'
const columns: TableColumn<Recordable>[] = [
    // { prop: 'Id', label: 'id' },
    { prop: 'No', label: '编号' },
    { prop: 'Name', label: '名称' },
    // { prop: 'SQLContent', label: 'SQLContent' },
    { prop: 'PageSize', label: 'PageSize' },
    { prop: 'OrderBy', label: 'OrderBy' },
    { prop: 'ViewType', label: 'ViewType' },
    { prop: 'OrderBy', label: 'OrderBy' },
    // { prop: 'Dimension', label: 'Dimension' },
    {
        prop: 'ColConfigs', label: 'ColConfigs', formatter: (_row, val) => {
            const colConfigs = val ? JSON.parse(val) : undefined
            return <div>
                {(colConfigs || []).map((colConfig) => {
                    return <el-tag>{colConfig.ColName}</el-tag>

                })}
            </div>
        }
    },
    {
        prop: 'Params', label: 'Params', formatter: (_row, val) => {
            const params = val ? JSON.parse(val) : undefined
            return <div>
                {(params || []).map((param) => {
                    return <el-tag>{param.ParamName}</el-tag>

                })}
            </div>
        }
    },

] 
</script>