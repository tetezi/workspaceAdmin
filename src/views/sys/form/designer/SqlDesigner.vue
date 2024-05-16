<template>
    <Designer ref="designerRef" :id="props.id" :tableId :formProps></Designer>
</template>
<script lang="ts" setup>
import { EmptyUUId } from '@/utils/uuid';
import { pick } from 'lodash';
import Designer from './Designer.vue';
import type { FormBind } from 'ttz-ui';
import { ref, unref } from 'vue';
const tableId = `d1d0924b-c262-4989-ab40-65b28c539bf2`
const props = defineProps<{
    id?: UUID
}>()
const designerRef = ref()
const formProps: FormBind = {
    defaultValue: { ViewType: 'List', ColConfigs: [], Params: [] },
    formSchemas: [
        {
            field: 'No', label: '编号', component: 'Input', ifShow: Boolean(props.id), componentProps: {
                disabled: true
            }
        },
        { field: 'Name', label: '名称', component: 'Input' },
        {
            field: 'Params', label: 'Params', component: 'EditableTable',
            componentStyle: {
                height: '300px',
            }, componentProps: {
                columns: [
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
        {
            field: 'SQLContent', label: 'SQLContent', component: 'Input', componentProps: {
                type: 'textarea',
            }
        },
        { field: 'PageSize', label: 'PageSize', component: 'Input' },
        { field: 'OrderBy', label: 'OrderBy', component: 'Input' },
        {
            field: 'ViewType', label: 'ViewType', component: 'Select', componentProps: {
                options: [{ value: 'List', label: 'List' }, { value: 'SingleObject', label: 'SingleObject' }]
            }
        },
        { field: 'Dimension', label: 'Dimension', component: 'Input' },
        {
            field: 'ColConfigs', label: 'ColConfigs', component: 'EditableTable', componentStyle: {
                height: '300px',
            }, componentProps: {
                columns: [
                    {
                        label: 'ColName', prop: 'ColName', editConfig: {
                            component: 'Input'
                        }
                    },
                    {
                        label: 'CountType', prop: 'CountType', editConfig: {
                            component: 'Input'
                        }
                    },
                    {
                        label: 'Value', prop: 'Value', editConfig: {
                            component: 'Input'
                        }
                    },
                ]
            }
        },

    ],
    beforeSubmit: (raw) => {
        return {
            ...pick(raw, ['SQLContent', 'Name', 'PageSize', 'OrderBy', 'ViewType', 'Dimension']),
            ColConfigs: (raw.ColConfigs || []).map((colConfig) => {
                return {
                    Id: colConfig.Id || EmptyUUId,
                    ...pick(colConfig, ['ColName', 'CountType', 'Value'])
                }

            }),
            Params: (raw.Params || []).map((param) => {
                return {
                    Id: param.Id || EmptyUUId,
                    ...pick(param, ['ParamName', 'SQLAffect'])
                }
            })
        }
    },
}
defineExpose({
    submit: () => unref(designerRef).submit()
})
</script>