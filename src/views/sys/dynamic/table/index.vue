<template>
    <div style="height: 100%;box-sizing: border-box;padding:8px  ">
        <TableComp style="padding:8 16px">
        </TableComp>
        <DialogFormComp>
        </DialogFormComp>
    </div>

</template>
<script lang="tsx" setup>
import { GetDynamicTables, GetDynamicTable, SaveDynamicTable, DelDynamicTable, type DynamicTable } from '@/api/sys/dynamic/table';
import { messageBoxConfirm } from '@/utils/message';
import { useTable, BasicButton, useDialogForm } from 'ttz-ui';
const [DialogFormComp, dialogFormMethods] = useDialogForm<DynamicTable>({
    width: '90%',
    closeOnClickModal: false,
    formSchemas: [
        { field: 'name', label: '名称', component: 'Input' },
        { field: 'tableName', label: '表名', component: 'Input' },

        {
            field: 'cols', label: '字段', component: 'EditableTable', componentStyle: {
                height: '500px'
            }, componentProps: {
                height: 500,
                addBtnValue: () => ({ canQuery: true, canWritable: true, }),
                columns: [
                    {
                        label: '字段名', prop: 'name', editConfig: {
                            component: 'Input'
                        }
                    },

                    {
                        label: '字段类型', prop: 'colType', editConfig: {
                            component: 'Select', componentProps: {
                                options: [
                                    { value: 'String', label: '字符串' },
                                    { value: 'Boolean', label: '布尔' },
                                    { value: 'Int', label: '数字' },
                                    { value: 'DateTime', label: '日期时间' },
                                    { value: 'SubTable', label: '子表' },
                                ]
                            }
                        }
                    },
                    {
                        label: '可写入', prop: 'canWritable', editConfig: {
                            component: 'Switch'
                        }
                    },

                    {
                        label: '可查询', prop: 'canQuery', editConfig: {
                            component: 'Switch'
                        }
                    },
                    {
                        label: '子表类型', prop: 'subTableType',
                        hide: ({ row }) => {
                            return row.colType !== 'SubTable'
                        },
                        editConfig: {
                            component: 'Select', componentProps: {
                                options: [{ value: 'ToOne', label: '对一' }, { value: 'ToMany', label: '对多' }]
                            }
                        }
                    },
                    /**
                     *TODO 弹窗选择子表 
                     */
                    {
                        label: '子表Id', prop: 'subTableId',
                        hide: ({ row }) => {
                            return row.colType !== 'SubTable'
                        },
                        editConfig: {
                            component: 'Input'
                        }
                    }, {
                        label: '子表写入策略', prop: 'subTableWritableStrategy', hide: ({ row }) => {
                            return row.colType !== 'SubTable' || !row.canWritable
                        }, editConfig: {
                            component: 'Select', componentProps: {
                                options: [
                                    { value: 'ConnectById', label: 'Id链接' },
                                    { value: 'UpsertByObject', label: '更新对象' },
                                ]
                            }
                        }
                    },
                    /**
                    *TODO 部分对象时需要再加一个配置，配置对应查询的节选字段
                    */
                    {
                        label: '子表查询策略', prop: 'subTableQueryStrategy', hide: ({ row }) => {
                            return row.colType !== 'SubTable' || !row.canQuery
                        }, editConfig: {
                            component: 'Select', componentProps: {
                                options: [
                                    { value: 'PartialObject', label: '部分对象' },
                                    { value: 'FullObject', label: '完整对象' },
                                ]
                            }
                        }
                    },
                ]
            }

        },
    ],
    submitApi: async (formData) => {
        return SaveDynamicTable(formData)
    },
    onClosed: () => tableMethods.reload()
})
const [TableComp, tableMethods] = useTable<Recordable>({
    rowKey: 'id',
    selectType: 'Select',
    showAllCheckbox: true,
    columns: [
        { prop: 'id', label: 'id' },
        { prop: 'name', label: '名称' },
        { prop: 'tableName', label: '表名' },
        {
            prop: 'cols', label: '字段',
            formatter: (_row, cols) => {
                return <div>
                    {(cols || []).map((col) => {
                        return <el-tag type={col.colType === 'SubTable' ? 'danger' : 'primary'}>{col.name}</el-tag>
                    })}
                </div>
            }
        },
        { prop: 'createdAt', label: '创建时间' },
        { prop: 'updatedAt', label: '编辑时间' },
    ],
    api: async (params, pageParams) => {
        return await GetDynamicTables(pageParams)
    },
    actionColumn: (row) => {
        return <div>
            <BasicButton func={() => edit(row)}>编辑</BasicButton>
            <BasicButton func={() => del(row)} type='danger'>删除</BasicButton>
        </div>
    },
    headerActionRender: () => <BasicButton func={add} type='primary'>新增</BasicButton>,
    title: '数据表管理',
})
async function add() {
    dialogFormMethods.open({ name: '', tableName: '', cols: [] })
}
async function edit(row) {
    const tableData = await GetDynamicTable(row.id)
    console.log(tableData)
    dialogFormMethods.open(tableData)
}
async function del(row) {
    await messageBoxConfirm(`确定要删除该记录吗？`, { title: '提示' }, async () => {
        await DelDynamicTable(row.id)
    })
    tableMethods.reload()
} 
</script>