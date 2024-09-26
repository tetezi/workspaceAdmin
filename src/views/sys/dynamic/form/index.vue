<template>
    <div style="height: 100%;box-sizing: border-box;padding:8px  ">
        <TableComp style="padding:8 16px">
        </TableComp>
        <DynamicFormConfigDialog ref="DynamicFormConfigDialogRef" @close="tableMethods.reload()">
        </DynamicFormConfigDialog>
    </div>

</template>
<script lang="tsx" setup>
import { GetDynamicForms, GetDynamicForm, DelDynamicForm, } from '@/api/sys/dynamic/form';
import { useTable, BasicButton } from 'ttz-ui';
import DynamicFormConfigDialog from './components/DynamicFormConfigDialog.vue'
import { ref, unref } from 'vue';
import { omit } from 'lodash';
const DynamicFormConfigDialogRef = ref<InstanceType<typeof DynamicFormConfigDialog>>()
const [TableComp, tableMethods] = useTable<Recordable>({
    rowKey: 'id',
    columns: [
        // { prop: 'id', label: 'id' },
        { prop: 'name', label: '名称' },
        { prop: 'createdAt', label: '创建时间' },
        { prop: 'updatedAt', label: '编辑时间' },
    ],
    api: async (params, pageParams) => {
        return await GetDynamicForms(pageParams)
    },
    actionColumn: (row) => {
        return <div>
            <BasicButton func={() => edit(row)}>编辑</BasicButton>
            <BasicButton func={() => del(row)} type='danger' isConfirm>删除</BasicButton>
        </div>
    },
    headerActionRender: () => <BasicButton func={add} type='primary'>新增</BasicButton>,
    title: '表单管理v2',
})
async function add() {
    unref(DynamicFormConfigDialogRef)?.open({ name: '', schemas: [] })
}
async function edit(row) {
    const tableData = await GetDynamicForm(row.id)
    const data = omit(tableData, 'createdAt', 'updatedAt')
    unref(DynamicFormConfigDialogRef)?.open(data)
}
async function del(row) {
    await DelDynamicForm(row.id)
    tableMethods.reload()
} 
</script>