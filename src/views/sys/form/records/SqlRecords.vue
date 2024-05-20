<template>
    <Records :tableId :columns :title :designer="SqlDesigner" :actionColumn></Records>
    <DebugDialogComp></DebugDialogComp>
</template>
<script lang="tsx" setup>
import Records from './Records.vue';
import { BasicButton, useDialog, useForm, type TableColumn } from 'ttz-ui';
import SqlDesigner from '../designer/SqlDesigner.vue';
import { computed, unref } from 'vue';
import { GetSIData } from '@/api/sys/interface';
import { isArray, isPlainObject } from 'lodash';

const tableId = `d1d0924b-c262-4989-ab40-65b28c539bf2`
const title = 'SQL配置表'
const columns: TableColumn<Recordable>[] = [
    { prop: 'No', label: '编号' },
    { prop: 'Name', label: '名称' },
    { prop: 'PageSize', label: 'PageSize' },
    { prop: 'OrderBy', label: 'OrderBy' },
    { prop: 'ViewType', label: 'ViewType' },
    { prop: 'OrderBy', label: 'OrderBy' },
    {
        prop: 'ColConfigs', label: 'ColConfigs', formatter: (_row, val) => {
            const colConfigs = val ? JSON.parse(val) : undefined
            return <div>
                {(colConfigs || []).map((colConfig) => {
                    return <el-tag>{colConfig.ColName}</el-tag>

                })}
            </div>
        }
    },
    {
        prop: 'Params', label: 'Params', formatter: (_row, val) => {
            const params = val ? JSON.parse(val) : undefined
            return <div>
                {(params || []).map((param) => {
                    return <el-tag>{param.ParamName}</el-tag>

                })}
            </div>
        }
    }
]

const [DebugDialogComp, debugDialogMethods] = useDialog<{
    No: string, Name: string, ViewType: string, Params: string, OrderBy: string, PageSize: string
}>({
    width: '90%',
    showActionBtns: false,
    bodyRender: (row) => {
        const [DeBugFormComp, deBugFormMethods] = useForm({
            formSchemas: [
                {
                    category: 'Container', component: 'Card', componentProps: { title: '请求体参数' }, ifShow: ({ formValue }) => {
                        return (formValue.params || []).length > 0
                    }, componentStyle: {
                        marginBottom: '10px'
                    }, children: [
                        {
                            labelShow: false,
                            field: 'params', component: 'EditableTable', componentStyle: {
                                maxHeight: '300px'
                            }, componentProps: () => {
                                return {
                                    addBtnText: false,
                                    columns: [
                                        {
                                            prop: 'paramName', label: '参数名', editConfig: {
                                                component: 'Input',
                                            }
                                        },
                                        {
                                            prop: 'paramType', label: '参数值类型', editConfig: ({ setRowFieldValue }) => {
                                                return {
                                                    component: 'Select',
                                                    componentProps: {
                                                        options: [
                                                            { label: 'string', value: 'string' },
                                                            { label: 'number', value: 'number' },
                                                            { label: 'bolean', value: 'bolean' },
                                                        ],
                                                        onChange: (val) => {
                                                            if (val === 'string') {
                                                                setRowFieldValue('value', '')
                                                            } else if (val === 'number') {
                                                                setRowFieldValue('value', 0)
                                                            }
                                                            else if (val === 'bolean') {
                                                                setRowFieldValue('value', false)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            prop: 'value', label: '值', editConfig: ({ row }) => {
                                                return {
                                                    component: row.paramType === 'bolean' ? 'Switch' : row.paramType === 'number' ? 'InputNumber' : 'Input'
                                                }
                                            }
                                        },
                                    ],

                                }
                            }
                        },
                    ]
                },
                {
                    category: 'Container', component: 'Card', componentProps: { title: '分页参数' }, componentStyle: {
                        marginBottom: '10px'
                    }, children: [
                        { field: ['page', 'pageSize'], label: 'pageSize', component: 'Input' },
                        { field: ['page', 'pageIndex'], label: 'pageIndex', component: 'Input' },
                        { field: ['page', 'orderBy'], label: 'orderBy', component: 'Input' },
                    ]
                },

                {
                    category: 'Container', component: 'Card', componentProps: { title: '返回' }, children: [
                        {
                            field: ['result', 'resultType'], component: 'Input', label: '是否成功', render: ({ compValue }) => {
                                const map = new Map([
                                    ['success', '成功',],
                                    ['danger', '失败',],
                                    ['warning', '返回格式不匹配',],
                                ])
                                return <el-tag type={unref(compValue)}>{map.get(unref(compValue))}</el-tag>
                            }
                        },
                        {
                            field: ['result', 'data'], component: 'Input', componentProps: {
                                type: 'textarea'
                            }, label: '返回结果'
                        },
                    ]
                },
                {
                    category: 'Display', component: 'BasicButton', componentStyle: {
                        width: '150px', float: 'right'
                    }, componentProps: ({ formValue }) => ({
                        label: '发送请求', type: 'primary', func: async () => {
                            const data = {}
                            formValue.params.forEach(({ paramName, value }) => {
                                data[paramName] = value
                            })
                            await GetSIData(row.No as any, data, formValue.page).then((res) => {
                                console.log({
                                    res, row
                                })
                                if (row.ViewType === 'List') {
                                    if (isArray(res?.rows)) {
                                        return deBugFormMethods.setFieldsValue('result', {
                                            resultType: 'success',
                                            data: JSON.stringify(res) as any,
                                        })
                                    }
                                } else if (row.ViewType === 'SingieObject') {
                                    if (isPlainObject(res)) {
                                        return deBugFormMethods.setFieldsValue('result', {
                                            resultType: 'success',
                                            data: JSON.stringify(res) as any,
                                        })
                                    }
                                }
                                return deBugFormMethods.setFieldsValue('result', {
                                    resultType: 'warning',
                                    data: JSON.stringify(res) as any,
                                })
                            }).catch((err) => {
                                console.log(err, 'eadw')
                                deBugFormMethods.setFieldsValue('result', {
                                    resultType: 'danger',
                                    data: err.toString() + '\n' + err?.response?.data?.Msg,
                                })
                                return
                            })
                        }
                    })
                },

            ]
        }, () => {
            const params = JSON.parse(row.Params)
            deBugFormMethods.setModelValue({
                page: {
                    orderBy: row.OrderBy,
                    pageSize: row.PageSize,
                    pageIndex: row.PageSize ? 1 : undefined,
                },
                params: (params || []).map(({ ParamName }) => ({
                    paramName: ParamName,
                    paramType: 'string',
                    value: '',
                }))
            })
        })
        return <DeBugFormComp></DeBugFormComp>
    },
})
const actionColumn = computed(() => (row) => {
    return <BasicButton func={() => {
        debugDialogMethods.setProps({
            title: `${row.Name}-${row.No}-调试`
        })
        debugDialogMethods.open(row)
    }} type='success'>调试</BasicButton>
}) 
</script>