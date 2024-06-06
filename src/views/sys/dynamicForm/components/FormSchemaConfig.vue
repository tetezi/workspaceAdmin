<template>
    <div style="height:100%;display: flex;flex-direction: column">

        <div style="flex:1 ;min-height: 0px; ">

            <el-scrollbar>
                <FormComp></FormComp>
            </el-scrollbar>
        </div>

        <div style=" width:100%; ">
            <BasicButton style=" width:33%" type="primary" :func="() => formMethods.submitFunction()">提交
            </BasicButton>
            <BasicButton style="width:33%" type="primary" :func="reset">重置</BasicButton>
            <BasicButton style="width:33%" type="danger" :func="del">删除</BasicButton>
        </div>
    </div>
</template>
<script lang="tsx" setup>
import { useForm, BasicButton, type DesignFormSchema } from 'ttz-ui';
import Draggable from 'vuedraggable'

import CodeValueInput from './CodeValueInput.vue'
import { ref, unref, computed, watch, getCurrentInstance } from 'vue';
import { cloneDeep } from 'lodash';
import { isUnDef } from '@/utils/is';
const emit = defineEmits<{
    submit: [key: string, v: any];
    del: [key: string]
}>()
const props = defineProps<{
    selectedSchema: any
    selectedParentSchema: any
}>()
const schemaKey = computed(() => unref(props.selectedSchema)?.schemaKey)
const [FormComp, formMethods] = useForm({
    labelPosition: 'top',
    formSchemas: [

        {
            field: 'schemaKey', label: 'schemaKey', component: 'Input', componentProps: {
                disabled: true
            }
        },
        {
            category: "Container", component: 'Row', children: [{
                field: 'category', label: '组件类别', component: 'Select', componentProps: {
                    options: [
                        { label: '容器', value: 'Container' },
                        { label: '输入', value: 'Input' },
                        { label: '仅展示', value: 'Display' },
                    ]
                },
                colProps: {
                    span: 12
                }
            },
            {
                field: 'component', label: '组件', component: 'Select', componentProps: ({ formValue }) => {

                    if (formValue.category === 'Container') {
                        return { options: [{ label: '卡片', value: 'Card' },] }

                    } else if (formValue.category === 'Input') {
                        return { options: [{ label: '文本框', value: 'Input' },] }

                    } else if (formValue.category === 'Display') {
                        return { options: [{ label: '按钮', value: 'BasicButton' },] }

                    } else {
                        return { options: [] }
                    }
                },
                colProps: {
                    span: 12
                }
            },]
        },
        {
            field: 'ifShow', label: '是否显示(默认true)', component: () => CodeValueInput, componentProps: {
                valueComponent: 'Switch',
            }, colProps: {
                span: 12
            }
        },
        {
            field: 'componentProps', label: 'Props', component: () => CodeValueInput, componentProps: {
                // valueComponent: 'Input'
            }
        },
        {
            field: 'componentStyle', label: '样式', component: () => CodeValueInput, componentProps: {
                // valueComponent: 'Input'
            }
        },
        {
            field: 'render', label: '渲染函数', component: () => CodeValueInput, componentProps: {
                // valueComponent: 'Input',
                tip: '请返回VNodeChild'
            }
        }, {
            field: 'componentSlot', label: '插槽', component: () => CodeValueInput, componentProps: {
                // valueComponent: 'Input',
                tip: '请返回Recordable<() => VNodeChild>'

            }
        },

        {
            category: 'Container', component: 'Card', componentProps: {
                title: '输入类型组件配置'
            }, ifShow: ({ formValue }) => {
                return formValue.category === 'Input'
            }, children: [
                {
                    field: 'field', label: '映射字段', component: 'Input',
                },
                {
                    field: 'labelShow', label: '显示字段名（默认true）', component: () => CodeValueInput, componentProps: {
                        valueComponent: 'Switch',
                    }
                },
                {
                    field: 'label', label: '字段名', component: () => CodeValueInput, componentProps: {
                        valueComponent: 'Input',
                    }
                },

                // {
                //     field: 'labelWidth', label: '字段名宽度（默认100px）', component: () => CodeValueInput, componentProps: {
                //         valueComponent: 'Input',
                //     }
                // },
                {
                    field: 'labelRender', label: '字段名渲染函数', component: () => CodeValueInput, componentProps: {
                        tip: '请返回VNodeChild'
                    }
                },
            ]
        },
        {
            category: 'Container', component: 'Card', componentProps: {
                title: '容器类型组件配置'
            }, ifShow: ({ formValue }) => {
                return formValue.category === 'Container'
            }, children: [
                {
                    field: 'children', label: '子元素', component: 'Input', render: ({ compValue }) => {

                        return <Draggable style="width: 100%;min-height: 100px;line-height: 1rem" item-key="schemaKey" group={{ name: 'formSchemas', pull: false, put: true }} modelValue={unref(compValue)} onUpdate:modelValue={(v) => compValue.value = v}>
                            {{
                                item: ({ element }) => {
                                    return <div style={{
                                        border: '1px solid black',
                                        textAlign: 'center',
                                        padding: '5px',
                                        margin: '5px',
                                    }} >
                                        <div>{element.component}</div>
                                    </div>
                                }
                            }}
                        </Draggable >
                    },
                },
            ]
        },

        {
            category: 'Container', component: 'Card', componentProps: {
                title: '分栏配置（父节点需为Row）'
            }, ifShow: ({ formValue }) => {
                return props.selectedParentSchema?.category === 'Container' && props.selectedParentSchema?.component === 'Row'
            }, children: [
                {
                    category: 'Display', component: 'BasicButton', componentStyle: { width: '100%' }, componentProps: ({ formValue, setFieldsValue }) => {
                        const enable = !isUnDef(formValue.colProps)
                        return ({
                            label: enable ? '关闭分栏配置' : '添加分栏配置',
                            type: enable ? 'danger' : 'primary',
                            func: () => {
                                if (enable) {
                                    setFieldsValue('colProps', undefined)
                                } else {
                                    setFieldsValue('colProps', {})
                                }
                            }
                        })
                    },
                },
                {
                    category: 'Container', component: 'Row', ifShow: ({ formValue }) => !isUnDef(formValue.colProps), children: [{
                        field: ['colProps', 'span'], label: 'span', component: 'InputNumber', colProps: { span: 12 },
                    }, {
                        field: ['colProps', 'offset'], label: 'offset', component: 'InputNumber', colProps: { span: 12 },
                    }, {
                        field: ['colProps', 'push'], label: 'push', component: 'InputNumber', colProps: { span: 12 },
                    }, {
                        field: ['colProps', 'pull'], label: 'pull', component: 'InputNumber', colProps: { span: 12 },
                    }, {
                        field: ['colProps', 'xs'], label: 'xs', component: 'InputNumber', colProps: { span: 12 },
                    }, {
                        field: ['colProps', 'sm'], label: 'sm', component: 'InputNumber', colProps: { span: 12 },
                    }, {
                        field: ['colProps', 'md'], label: 'md', component: 'InputNumber', colProps: { span: 12 },
                    }, {
                        field: ['colProps', 'lg'], label: 'lg', component: 'InputNumber', colProps: { span: 12 },
                    }, {
                        field: ['colProps', 'xl'], label: 'xl', component: 'InputNumber', colProps: { span: 12 },
                    },]
                },

            ]
        },
    ],
    onSubmit: (v) => {
        emit('submit', unref(schemaKey), v)
        console.log(v)
    }
}, () => {
    reset()
    watch(() => props.selectedSchema, reset)
})
function reset() {
    formMethods.setModelValue(cloneDeep(props.selectedSchema))
}
function del() {
    emit('del', unref(schemaKey))
} 
</script>