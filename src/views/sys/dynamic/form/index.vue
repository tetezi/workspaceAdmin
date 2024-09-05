<template>
    <div style="height: 100%;box-sizing: border-box;padding:8px  ">
        <TableComp style="padding:8 16px">
        </TableComp>
        <DialogFormComp>
        </DialogFormComp>
    </div>

</template>
<script lang="tsx" setup>
import { type DynamicForm, SaveDynamicForm, GetDynamicForms, GetDynamicForm, DelDynamicForm } from '@/api/sys/dynamic/form';
import { messageBoxConfirm } from '@/utils/message';
import { useTable, BasicButton, useDialogForm } from 'ttz-ui';
import FormDesigner from './components/FormDesigner.vue'
const [DialogFormComp, dialogFormMethods] = useDialogForm<DynamicForm>({
    width: '90%',
    closeOnClickModal: false,
    formSchemas: [
        { field: 'name', label: '名称', component: 'Input' },
        {
            field: 'description', label: '备注', component: 'Input', componentProps: {
                type: 'textarea'
            }
        },
        {
            field: 'schemas', label: '设计器', component: () => FormDesigner, componentStyle: {
                height: '400px'
            }
        },
    ],
    beforeSubmit: (params) => {
        return {
            ...params,
            schemas: JSON.stringify(params.schemas)
        }
    },
    submitApi: async (formData) => {
        return SaveDynamicForm(formData)
    },
    onClosed: () => tableMethods.reload()
})
const [TableComp, tableMethods] = useTable<Recordable>({
    rowKey: 'id',
    columns: [
        { prop: 'id', label: 'id' },
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
            <BasicButton func={() => del(row)} type='danger'>删除</BasicButton>
        </div>
    },
    headerActionRender: () => <BasicButton func={add} type='primary'>新增</BasicButton>,
    title: '表单管理',
})
async function add() {
    dialogFormMethods.open({ name: '', schemas: [] })
}
async function edit(row) {
    const tableData = await GetDynamicForm(row.id)
    dialogFormMethods.open({
        ...tableData,
        schemas: JSON.parse(tableData.schemas)
    })
}
async function del(row) {
    await messageBoxConfirm(`确定要删除该记录吗？`, { title: '提示' }, async () => {
        await DelDynamicForm(row.id)
    })
    tableMethods.reload()
} 
</script>