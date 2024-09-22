<template>

    <div style='width:100%'>

        <div style="display: flex;justify-content: space-between;">
            <div>
                <BasicButton v-if="isUndefined(modelValue)" icon="Plus" size='small' circle :func="initialize"
                    tip="添加配置">
                </BasicButton>
                <template v-else>
                    <BasicButton icon="Refresh" size='small' circle :func="toggleType" tip="切换模式" v-if="hasComponent">
                    </BasicButton>
                    <BasicButton icon="Close" size='small' circle :func="clear" tip="清空配置"></BasicButton>
                </template>
            </div>
            <span v-if="modelValue && modelValue.type === 'code'" style="color: #8A8E97;margin-right:5px">
                {{ tip }}
            </span>
        </div>
        <FormComp v-model="modelValue" style='width:100%'>
        </FormComp>
    </div>
</template>
<script lang="tsx" setup>
import { useForm, BasicButton, type ComponentType } from 'ttz-ui';
import CodeEditor from './CodeEditor.vue'
import { unref, computed, type Component } from 'vue'
import { isUndefined } from "lodash";
type Props = {
    valueComponent?: (() => Component) | ComponentType<"Input">;
    tip?: string
}
const props = defineProps<Props>()
const modelValue = defineModel<{ type: 'code' | 'value', code?: string, value?: string }>()
const [FormComp] = useForm({
    formSchemas: [
        {
            labelShow: false, field: 'value', label: '值', ifShow: ({ formValue }) => formValue?.type == 'value',
            component: props.valueComponent as any
        }, {
            labelShow: false, field: 'code', label: '代码', ifShow: ({ formValue }) => formValue?.type == 'code',
            component: () => CodeEditor,
            componentProps: {
                tip: props.tip
            },
            componentStyle: () => {
                return {
                    height: '150px',
                }
            }
        },
    ],
})
const hasComponent = computed(() => {
    return !isUndefined(props.valueComponent)
})
function toggleType() {
    if (unref(modelValue)?.type === 'value') {
        modelValue.value = {
            type: 'code'
        }

    } else if (unref(modelValue)?.type === 'code') {
        modelValue.value = {
            type: 'value'
        }
    }
}
function initialize() {
    modelValue.value = {
        type: unref(hasComponent) ? 'value' : 'code'
    }
}
function clear() {
    modelValue.value = undefined
}
</script>