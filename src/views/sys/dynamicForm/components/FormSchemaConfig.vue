<template>

    <div>
        <FormComp style="max-height: 100%; "></FormComp>
        <div style=" width:100%; ">
            <BasicButton style="width:33%" type="primary" :func="() => formMethods.submitFunction()">提交
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
import { ref, unref, computed, watch } from 'vue';
import { cloneDeep } from 'lodash';
const emit = defineEmits<{
    submit: [key: string, v: any];
    del: [key: string]
}>()
const props = defineProps<{
    selectedSchema: any
}>()
const schemaKey = computed(() => unref(props.selectedSchema)?.id)
const [FormComp, formMethods] = useForm({
    formSchemas: [
        {
            field: 'id', label: 'id', component: 'Input', componentProps: {
                disabled: true
            }
        },
        {
            field: 'category', label: '组件类别', component: 'Select', componentProps: {
                options: [
                    { label: '容器', value: 'Container' },
                    { label: '输入', value: 'Input' },
                    { label: '仅展示', value: 'Display' },
                ]
            },
            formItemProps: {
                style: { width: '50%', display: 'inline-block' }
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
            formItemProps: {
                style: { width: '50%', display: 'inline-block' }
            }
        },
        {
            field: 'ifShow', label: '是否显示', component: () => CodeValueInput, componentProps: {
                valueComponent: 'Switch',
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
                    field: 'label', label: '字段名', component: () => CodeValueInput, componentProps: {
                        valueComponent: 'Input',
                    }
                },
                {
                    field: 'labelShow', label: '显示字段名', component: () => CodeValueInput, componentProps: {
                        valueComponent: 'Switch',
                    }
                },
                {
                    field: 'labelWidth', label: '字段名宽度', component: () => CodeValueInput, componentProps: {
                        valueComponent: 'Input',
                    }
                },
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

                        return <Draggable style="width: 100%;min-height: 100px;line-height: 1rem" item-key="id" group={{ name: 'formSchemas', pull: false, put: true }} modelValue={unref(compValue)} onUpdate:modelValue={(v) => compValue.value = v}>
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
    ],
    onSubmit: (v) => {
        emit('submit', unref(schemaKey), v)
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