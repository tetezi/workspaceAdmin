<template>
    SqlDesigner
    <FormComponent></FormComponent>
    <BasicButton type="primary" style="width: 100%;" :func="() => formMethods.submitFunction()">提交</BasicButton>
</template>
<script lang="tsx" setup>
import { SaveTableRecord } from '@/api/sys/form';
import { EmptyUUId } from '@/utils/uuid';
import { useForm, BasicButton } from 'ttz-ui'
const [FormComponent, formMethods] = useForm({
    defaultValue: { TableId: '', Id: EmptyUUId, Cols: [] },
    formSchemas: [
        // { field: 'TableId', label: 'TableId', component: 'Input' },
        { field: 'Id', label: 'Id', component: 'Input' },
        { field: 'No', label: 'No', component: 'Input' },
        { field: 'Name', label: 'Name', component: 'Input' },
        { field: 'SQLContent', label: 'SQLContent', component: 'Input' },
        { field: 'PageSize', label: 'PageSize', component: 'Input' },
        { field: 'OrderBy', label: 'OrderBy', component: 'Input' },
        {
            field: 'ViewType', label: 'ViewType', component: 'Select', componentProps: {
                options: [{ value: 'Table', label: 'Table' }, { value: 'VerticalTable', label: 'VerticalTable' }]
            }
        },
        { field: 'ColConfig', label: 'ColConfig', component: 'Input' },
        { field: 'Dimension', label: 'Dimension', component: 'Input' },
        {
            field: 'ParamList', label: 'ParamList', component: 'EditableTable', componentProps: {
                addBtnValue: { Id: EmptyUUId },
                columns: [
                    {
                        label: 'Id', prop: 'Id'
                    },
                    {
                        label: 'ParamName', prop: 'ParamName', editConfig: {
                            component: 'Input'
                        }
                    },
                    {
                        label: 'SQLAffect', prop: 'SQLAffect', editConfig: {
                            component: 'Input'
                        }
                    },
                ]
            }

        },
    ],
    submitApi: async (params) => {
        console.log(params)
        await SaveTableRecord('', params)
    }
}) 
</script>