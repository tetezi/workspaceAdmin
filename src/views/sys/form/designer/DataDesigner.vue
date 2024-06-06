<template>
    <Designer ref="designerRef" :id="props.id" :tableId :formProps></Designer>
</template>
<script lang="ts" setup>
import { pick } from 'lodash';
import Designer from './Designer.vue';
import { EmptyUUId, type FormBind } from 'ttz-ui';
import { ref, unref } from 'vue';
const tableId = '2D726258-9506-4E95-ABFD-657433AC8416'
const props = defineProps<{
    id?: UUID
}>()
const designerRef = ref()
const formProps: FormBind = {
    defaultValue: { Cols: [] },
    formSchemas: [
        {
            field: 'No', label: '编号', component: 'Input', ifShow: Boolean(props.id), componentProps: {
                disabled: true
            }
        },
        { field: 'Name', label: '名称', component: 'Input' },
        { field: 'TableName', label: 'TableName', component: 'Input' },

        {
            field: 'Cols', label: 'Cols', component: 'EditableTable', componentStyle: {
                height: '500px'
            }, componentProps: {
                height: 500,
                columns: [
                    // {
                    //     label: 'Id', prop: 'Id'
                    // },
                    {
                        label: 'No', prop: 'No', hide: ({ row }) => {
                            return !row.Id
                        }, editConfig: {
                            component: 'Input',
                            componentProps: {
                                disabled: true
                            }
                        }
                    },
                    {
                        label: 'Name', prop: 'Name', editConfig: {
                            component: 'Input'
                        }
                    },

                    {
                        label: 'ColType', prop: 'ColType', editConfig: {
                            component: 'Select', componentProps: {
                                options: [
                                    { value: 'Id', label: 'Id' },
                                    { value: 'String', label: 'String' },
                                    { value: 'Bool', label: 'Bool' },
                                    { value: 'Int', label: 'Int' },
                                    { value: 'Decimal', label: 'Decimal' },
                                    { value: 'Decimal', label: 'Decimal' },
                                    { value: 'DateTime', label: 'DateTime' },
                                    { value: 'SubTable', label: 'SubTable' },
                                ]

                            }
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
    beforeSubmit: (raw) => {
        return {
            ...pick(raw, ['TableName', 'Name']),
            Cols: raw.Cols.map((col) => {
                return {
                    Id: col.Id || EmptyUUId,
                    ...pick(col, ['Name', 'ColType', 'IsSubTable', 'SubTableType', 'SubTableId'])
                }
            })
        }
    },
}
defineExpose({
    submit: () => unref(designerRef).submit()
})
</script>