<template>
    <div style="height: 100%;display: flex;flex-direction: column;">
        <div :style="{ textAlign: 'center', margin: '5px', }">预设组件</div>
        <el-scrollbar style="flex:1">
            <el-collapse v-model="activeNames">
                <el-collapse-item v-for="group in preinstall" :name="group.name" :key="group.name">
                    <template #title>
                        <div style="margin: 5px">{{ group.title }}</div>
                    </template>
                    <div style="background-color: #409EFF; color: white;padding:1px">
                        <Draggable :list='group.list' item-key="schemaKey"
                            :group="{ name: 'formSchemas', pull: 'clone', put: false }" :clone>
                            <template #item="{ element }">
                                <div :style="{
                                    border: '1px solid black',
                                    borderRadius: '5px',
                                    padding: '5px',
                                    margin: '5px',
                                    textAlign: 'center',
                                    // color: 'white',
                                    // backgroundColor: '#409EFF'
                                }"> {{ element.alias || element.component }}</div>
                            </template>
                        </Draggable>
                    </div>

                </el-collapse-item>
            </el-collapse>
        </el-scrollbar>

    </div>

</template>
<script lang="ts" setup>


import { cloneDeep, omit } from 'lodash';
import { ref } from 'vue';
import Draggable from 'vuedraggable'; 
import { buildUUID } from "@/utils/uuid";

const preinstall = [
    {
        title: '输入', name: '1', list: [
            {
                alias: '单选框', component: 'Radio', category: 'Input', componentProps: {
                    type: 'code',
                    code: `return {options:[{label:'选项一',value:1},{label:'选项二',value:2}]}`
                },
            }, {
                alias: '基础下拉框', component: 'Select', category: 'Input', componentProps: {
                    type: 'code',
                    code: `return {
    options:[
        {label:'选项一',value:1},
        {label:'选项二',value:2}
    ]
}`
                },
            }, {
                alias: 'Api下拉框', component: 'ApiSelect', category: 'Input', componentProps: {
                    type: 'code',
                    code: `return {
    //请求方法
    api: async (params) => {
        console.log('发起请求', params)
        return []
    },
    //请求参数函数
    params: () => {
        //绑定表单值，可取其他值为依赖动态修改参数并触发请求
        const { formValue } = renderParams
        return {
            q: formValue.q
        }
    }
}`
                },
            }, {
                alias: 'GetSIData下拉框', component: 'GetSIDataSelect', category: 'Input', componentProps: {
                    type: 'code',
                    code: `return {
                        //请求方法
    configLabel:'Init_应用列表',
    //请求参数函数
    labelField: 'Name',
    valueField:'Id',
    params: () => {
        //绑定表单值，可取其他值为依赖动态修改参数并触发请求
        const { formValue } = renderParams
        return {
            q: formValue.q
        }
    }
}`
                },
            }, {
                alias: '文本框', component: 'Input', category: 'Input',
            }, {
                alias: '数字框', component: 'InputNumber', category: 'Input',
            }, {
                alias: '滑块', component: 'Slider', category: 'Input',
            }, {
                alias: '开关', component: 'Switch', category: 'Input',
            }, {
                alias: '日期选择器', component: 'DatePicker', category: 'Input',
            }, {
                alias: '行内编辑', component: 'EditableTable', category: 'Input', componentProps: {
                    type: 'code',
                    code: `return { 
    columns: [{ prop: 'title', label: '标题' },{prop:'name',label:'姓名',editConfig:{component:'Input'}}],
    rowKey: 'id', 
    addBtnValue:{title:'测试1'}, 
}`
                }
            }, {
                alias: '表格穿梭选择', component: 'TableTransfer', category: 'Input', componentProps: {
                    type: 'code',
                    code: `return {
    title: () => '请勾选后转移至右侧',
    columns: [{ prop: 'title', label: '标题' }],
    rowKey: 'id',
    //本地固定可选项
    unSelectedData: [{ id: 'asd' }, { id: 'www' }, { id: 'f' }],
    //通过api请求可选项
    api: () => { },
    params: () => { }
}`
                }
            },
        ]
    }, {
        title: '仅显示', name: '2', list: [
            {
                alias: '按钮', component: 'BasicButton', category: 'Display',
                componentProps: {
                    type: 'code',
                    code: (
                        `return  {
    label: '按钮',
    func: () => {
        console.log('点击了按钮')
    }
}`)
                }
            },
        ]
    }, {
        title: '容器', name: '3', list: [
            {
                alias: '卡片', component: 'Card',
                category: 'Container',
                componentProps: {
                    type: 'code',
                    code:
                        `return {
    title:'标题'
}`
                }, children: [
                    {
                        component: 'Input', category: 'Input'
                    },
                ]
            }, {
                alias: '分栏', component: 'Row',
                category: 'Container', 
                children: [{
                    component: 'Input', category: 'Input', colProps: {
                        span: 12
                    }
                }, {
                    component: 'Input', category: 'Input', colProps: {
                        span: 12
                    }
                },],
            },
        ]
    }
]
const activeNames = ref(preinstall.map(({ name }) => name))
function clone(raw) {
    const data = cloneDeep(raw)
    function getCloneConfig(config) {
        const schemaKey = buildUUID()
        const displayConfig = (config.category === 'Display') ? {
        } : undefined
        const containerConfig = (config.category === 'Container') ? {
        } : undefined
        const inputConfig = (config.category === 'Input') ? {
            field: `${config.component}_${buildUUID()}`,
            label: config.component,
            labelShow: {
                type: 'value',
                value: true
            },
            labelWidth: undefined,
            labelRender: undefined,
        } : undefined
        return {
            componentProps: undefined,
            componentStyle: undefined,
            componentSlot: undefined,
            ifShow: undefined,
            render: undefined,
            ...displayConfig,
            ...inputConfig,
            ...containerConfig,
            ...omit(config, 'alias'),
            schemaKey,
            children: (config.category === 'Container') ? ((config.children || []).map(getCloneConfig)) : undefined
        }
    }
    return getCloneConfig(data)
}
document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
};
</script>
<style scoped>
:deep(.el-collapse-item__content) {
    padding-bottom: 0px
}
</style>