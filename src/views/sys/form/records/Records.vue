<template>
    <div style="height: 100%;box-sizing: border-box;padding:8px  ">
        <TableComp style="padding:8 16px">
        </TableComp>
        <DialogComp>
        </DialogComp>
    </div>

</template>
<script lang="tsx" setup>
import { GetTableRecordPage } from '@/api/sys/form';
import { useTable, BasicButton, useDialog, type TableColumn, type TableBind, BasicTable } from 'ttz-ui';
import { type Component, type VNodeChild, ref, unref, h } from 'vue';
const props = defineProps<{
    tableId: UUID,
    title: string,
    columns: TableColumn<Recordable>[],
    actionColumn?: (row: Recordable) => VNodeChild//TableBind<Recordable>['actionColumn']
    designer: Component<Recordable>
}>()
const [DialogComp, dialogMethods] = useDialog<undefined | string>(() => {
    const dataDesignerRef = ref()
    return {
        width: '90%',
        submitApi: async () => {
            if (unref(dataDesignerRef).submit) {
                return unref(dataDesignerRef).submit()
            } else {
                return Promise.reject()
            }
        },
        onClose: () => {
            tableMethods.reload()
        },
        bodyRender: (id) => {
            return h(props.designer, {
                ref: dataDesignerRef,
                id, style: {
                    maxHeight: '85vh', overflow: 'auto'
                }
            })
        },
        alignCenter: true,
        destroyOnClose: true,
        title: props.title,
    }
})
const [TableComp, tableMethods] = useTable<Recordable>({
    columns: props.columns,
    api: async (params, pageParams) => {
        const res = await GetTableRecordPage(props.tableId, pageParams, params)
        return res
    },
    actionColumn: (row) => {
        return <div>
            <BasicButton func={() => edit(row)}>编辑</BasicButton>
            {(props.actionColumn?.(row))}
        </div>
    },
    headerActionRender: <BasicButton func={add} type='primary'>新增</BasicButton>,
    title: props.title,
})
async function edit(row) {
    dialogMethods.open(row.Id)
}
async function add() {
    dialogMethods.open(undefined)
}
defineExpose({
    reload: () => tableMethods.reload()
})
</script>