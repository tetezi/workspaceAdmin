<template>
    <TableComp style="padding:8 16px">
    </TableComp>
</template>
<script lang="tsx" setup>
import { DelDynamicTableRecored, GetDynamicTableRecored, GetDynamicTableRecoreds, SaveDynamicTableRecored } from '@/api/sys/dynamic/tableRecored';
import { BasicButton, useTable } from 'ttz-ui';
const props = defineProps<{
    title: string,
    /**
    * TODO:需要处理其他数据源格式
    */
    dataSourceType: 'DynamicTable',
    dynamicTableId?: UUID
    columns: Recordable[]
    add: () => void
    edit: (row: Recordable) => void
    del: (row: Recordable) => void
}>()


const [TableComp, tableMethods] = useTable(() => ({
    title: props.title,
    api: async (params, pageParams) => {
        if (props.dataSourceType === 'DynamicTable') {
            return await GetDynamicTableRecoreds(props.dynamicTableId!, pageParams)
        } else {
            /**
             * TODO:需要处理其他数据源格式
             */
        }

    },
    columns: () => {
        if (props.dataSourceType === 'DynamicTable') {
            return (props.columns || []).map((column) => {
                return {
                    prop: column.prop,
                    label: column.label,
                    showOverflowTooltip: column.showOverflowTooltip,
                    width: column.width,
                    formatter: column.transform ? (row) => {
                        // column.transform
                        /**
                         * 需要处理转换函数
                         */
                        return row[column.prop]
                    } : undefined
                }
            })
        } else {
            /**
            * TODO:需要处理其他数据源格式
            */
            return []
        }

    },
    actionColumn: (row) => {
        return <div>
            <BasicButton func={() => props.edit(row)}>编辑</BasicButton>
            <BasicButton func={() => props.del(row)} type='danger'>删除</BasicButton>
        </div>
    },
    headerActionRender: () => <BasicButton func={() => props.add()} type='primary'>新增</BasicButton>,
}))
defineExpose({
    saveRecored: async (data) => {
        if (props.dataSourceType === 'DynamicTable') {
            return await SaveDynamicTableRecored(props.dynamicTableId!, data)
        } else {
            /**
             * TODO:需要处理其他数据源格式
             */
        }
    },
    getRecored: async (id) => {
        if (props.dataSourceType === 'DynamicTable') {
            return await GetDynamicTableRecored(props.dynamicTableId!, id)
        } else {
            /**
             * TODO:需要处理其他数据源格式
             */
        }
    },
    delRecored: async (id) => {
        if (props.dataSourceType === 'DynamicTable') {
            return await DelDynamicTableRecored(props.dynamicTableId!, id)
        } else {
            /**
             * TODO:需要处理其他数据源格式
             */
        }
    },
    reload: async () => {
        return tableMethods.reload()
    }
})
</script>