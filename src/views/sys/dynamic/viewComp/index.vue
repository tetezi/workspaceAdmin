<template>
    <div style="height: 100%;box-sizing: border-box;padding:8px  ">
        <TableComp style="padding:8 16px">
        </TableComp>
        <DialogFormComp>
        </DialogFormComp>
    </div>

</template>
<script lang="tsx" setup>
import { DelDynamicFormViewComp, GetDynamicFormViewComp, GetDynamicFormViewComps, SaveDynamicFormViewComp, type DynamicFormViewComp } from '@/api/sys/dynamic/formViewComp';
import { messageBoxConfirm } from '@/utils/message';
import { useTable, BasicButton, useDialogForm } from 'ttz-ui';
import { pick } from 'lodash';
import { GetDynamicForms } from '@/api/sys/dynamic/form';
import { GetDynamicTables } from '@/api/sys/dynamic/table';
const [DialogFormComp, dialogFormMethods] = useDialogForm<DynamicFormViewComp>({
    width: '90%',
    closeOnClickModal: false,
    formSchemas: [
        { field: 'name', label: '名称', component: 'Input' },

        {
            category: 'Container', component: 'Row', children: [{
                colProps: { span: 12 },
                field: 'dataSourceType', label: '数据源类型', component: 'Select', componentProps: {
                    options: [{ value: 'DynamicTable', label: '轻代码数据表' }]
                }
            }, {
                colProps: { span: 12 },
                field: 'dynamicTableId', label: '轻代码数据表', component: 'ApiSelect', componentProps: {
                    api: GetDynamicTables, labelField: 'name', valueField: 'id', placeholder: '请选择轻代码数据表', immediate: true
                }, ifShow: ({ formValue }) => formValue.dataSourceType === 'DynamicTable', labelShow: false
            },
            ]
        },
        {
            category: 'Container', component: 'Row', children: [{
                colProps: { span: 12 },
                field: 'formSourceType', label: '表单源类型', component: 'Select', componentProps: {
                    options: [{ value: 'DynamicForm', label: '轻代码表单' }]
                }
            },
            {
                colProps: { span: 12 },
                field: 'dynamicFormId', label: '轻代码表单', component: 'ApiSelect', componentProps: {
                    api: GetDynamicForms, labelField: 'name', valueField: 'id', placeholder: '请选择轻代码表单', immediate: true
                }, ifShow: ({ formValue }) => formValue.formSourceType === 'DynamicForm', labelShow: false
            },
            ]
        },



    ],
    submitApi: async (formData) => {
        return SaveDynamicFormViewComp(formData)
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
        return await GetDynamicFormViewComps(pageParams)
    },
    actionColumn: (row) => {
        return <div>
            <BasicButton func={() => edit(row)}>编辑</BasicButton>
            <BasicButton func={() => del(row)} type='danger'>删除</BasicButton>
        </div>
    },
    headerActionRender: () => <BasicButton func={add} type='primary'>新增</BasicButton>,
    title: '表单视图组件管理',
})
async function add() {
    dialogFormMethods.open({ name: '', dataSourceType: 'DynamicTable', formSourceType: 'DynamicForm' })
}
async function edit(row) {
    const tableData = await GetDynamicFormViewComp(row.id)
    dialogFormMethods.open({
        ...pick(tableData, ['id', 'name', 'dataSourceType', 'formSourceType', 'dynamicTableId', 'dynamicFormId']),
    })
}
async function del(row) {
    await messageBoxConfirm(`确定要删除该记录吗？`, { title: '提示' }, async () => {
        await DelDynamicFormViewComp(row.id)
    })
    tableMethods.reload()
} 
</script>