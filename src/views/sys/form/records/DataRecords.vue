<template>
    <Records :tableId :columns :title :designer="DataDesigner"></Records>
</template>
<script lang="tsx" setup>
import Records from './Records.vue';
import { type TableColumn } from 'ttz-ui';
import DataDesigner from '../designer/DataDesigner.vue';
const tableId = '2D726258-9506-4E95-ABFD-657433AC8416'
const title = `数据配置表`
const columns: TableColumn<Recordable>[] = [
    { prop: 'Id', label: 'id' },
    { prop: 'No', label: '编号' },
    { prop: 'Name', label: '名称' },
    { prop: 'TableName', label: '表名' },
    {
        prop: 'Cols', label: '字段',
        formatter: (_row, val) => {
            const cols = JSON.parse(val)
            return <div>
                {(cols || []).map((cols) => {
                    return <el-tag>{cols.Name}</el-tag>

                })}
            </div>
            // const tableVNode = <BasicTable style={{ height: '300px' }} modelValue={cols} pageConfigs={false} columns={[
            //     { prop: 'id', label: 'id' },
            //     { prop: 'name', label: '字段名' },
            //     { prop: 'label', label: '名称' },
            //     { prop: 'no', label: '编号' },
            //     { prop: 'colType', label: '字段类型' },
            //     { prop: 'isSubTable', label: '是否子表' },
            //     {
            //         prop: 'subTableType', label: '子表类型', formatter: (row, subTableType) => {
            //             if (!row.isSubTable) {
            //                 return '-'
            //             } else {
            //                 return subTableType
            //             }
            //         }
            //     },
            //     {
            //         prop: 'subTable', label: '子表', formatter: (row, subTable) => {
            //             if (!row.isSubTable) {
            //                 return '-'
            //             } else {
            //                 return subTable?.tableName
            //             }
            //         }
            //     },
            // ]}></BasicTable>
            // return <el-popover width="80%" >
            //     {{
            //         reference: () => {
            //             console.log(3, row.tableName, cols)
            //             return <div>
            //                 {cols.map((cols) => {
            //                     return <el-tag>{cols.name}</el-tag>

            //                 })}
            //             </div>
            //         },
            //         default: () => {
            //             console.log(2, row.tableName, cols)
            //             return <tableVNode>asd</tableVNode>
            //         }
            //     }}
            // </el-popover>
        }
    },
    // { prop: 'createdTime', label: '创建时间' },
    // { prop: 'modifiedTime', label: '编辑时间' },
]
</script>