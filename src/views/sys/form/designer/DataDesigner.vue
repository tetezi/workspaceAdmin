<template>
    <FormComponent></FormComponent>
    <BasicButton type="primary" style="width: 100%;" :func="() => formMethods.submitFunction()">提交</BasicButton>
</template>
<script lang="tsx" setup>
import { SaveTableRecord } from '@/api/sys/form';
import { EmptyUUId } from '@/utils/uuid';
import { useForm, BasicButton } from 'ttz-ui'
const [FormComponent, formMethods] = useForm({
    defaultValue: { Id: EmptyUUId, Cols: [] },
    formSchemas: [
        // { field: 'TableId', label: 'TableId', component: 'Input' },
        { field: 'Id', label: 'Id', component: 'Input' },
        { field: 'TableName', label: 'TableName', component: 'Input' },
        { field: 'Name', label: 'Name', component: 'Input' },
        { field: 'No', label: 'No', component: 'Input' },
        {
            field: 'Cols', label: 'Cols', component: 'EditableTable', componentProps: {
                addBtnValue: { Id: EmptyUUId },
                columns: [
                    {
                        label: 'Id', prop: 'Id'
                    },
                    {
                        label: 'Name', prop: 'Name', editConfig: {
                            component: 'Input'
                        }
                    },
                    {
                        label: 'No', prop: 'No', editConfig: {
                            component: 'Input'
                        }
                    },
                    {
                        label: 'ColType', prop: 'ColType', editConfig: {
                            component: 'Input'
                        }
                    }, {
                        label: 'IsSubTable', prop: 'IsSubTable', editConfig: {
                            component: 'Switch'
                        }
                    },
                    {
                        label: 'SubTableType', prop: 'SubTableType',
                        hide: ({ row }) => {
                            return !row.IsSubTable
                        },
                        editConfig: {
                            component: 'Select', componentProps: {
                                options: [{ value: 'One', label: 'One' }, { value: 'Many', label: 'Many' }]
                            }
                        }
                    }, {
                        label: 'SubTableId', prop: 'SubTableId',
                        hide: ({ row }) => {
                            return !row.IsSubTable
                        }, editConfig: {
                            component: 'Input'
                        }
                    }
                ]
            }

        },
    ],
    submitApi: async (params) => {
        console.log(params)
        await SaveTableRecord('2D726258-9506-4E95-ABFD-657433AC8416', params)
    }
}) 
</script>