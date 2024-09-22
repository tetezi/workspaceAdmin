<template>
    <DialogFormComp></DialogFormComp>

</template>
<script lang="tsx" setup>
import type { DynamicFormSchemaType } from '@/components/DynamicFormDialog/types';
import { useDialogForm, containerComponentMap, inputComponentMap, displayComponentMap, useForm, narrow } from 'ttz-ui';
import { ref, unref } from 'vue';
import { cloneDeep, } from 'lodash'
import CodeValueInput from './CodeValueInput.vue'
const props = defineProps<{
    renderParams: any[]
}>()
const emit = defineEmits<{
    submit: [data: DynamicFormSchemaType, meta: any]
}>()
const metaRef = ref()
const containerComponentOptions = Array.from(containerComponentMap.keys()).map(key => ({
    label: key, value: key
}));
const inputComponentOptions = Array.from(inputComponentMap.keys()).map(key => ({
    label: key, value: key
}));
const displayComponentOptions = Array.from(displayComponentMap.keys()).map(key => ({
    label: key, value: key
}));

const [DialogFormComp, dialogFormMethods] = useDialogForm<DynamicFormSchemaType>({
    title: `表单子项配置`,
    labelPosition: 'top',
    height: '80vh',
    width: '80vw',
    formSchemas: [
        {
            field: 'name', label: '名称', component: 'Input', colProps: { span: 4 }, tip: '输入类型组件将会被视为label'
        }, {
            field: 'field', label: '映射字段', component: 'Input',
            ifShow: ({ formValue }) => {
                return formValue.category === 'Input'
            }, colProps: { span: 4 }, tip: '可用符号.深度映射，如：a.b，但请确保a已声明而非“a is not defined”'
        },
        { field: 'colProps.span', label: '分栏span', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
        {
            field: 'category', label: '组件类别', component: 'Select', componentProps: ({ formMethods }) => ({
                options: [
                    { label: '容器', value: 'Container' },
                    { label: '输入', value: 'Input' },
                    { label: '仅展示', value: 'Display' },
                ],
                onChange: () => {
                    formMethods.setFieldsValue('component', '')
                },
            }), colProps: { span: 4 },
        },
        {
            field: 'component', label: '组件', component: 'Select', componentProps: ({ formValue }) => {
                if (formValue.category === 'Container') {
                    return { options: containerComponentOptions }

                } else if (formValue.category === 'Input') {
                    return { options: [...inputComponentOptions, { label: 'EnumSelect', value: 'EnumSelect' }] }

                } else if (formValue.category === 'Display') {
                    return { options: displayComponentOptions }

                } else {
                    return { options: [] }
                }
            }, colProps: { span: 4 },
        },

        {
            field: 'ifShow', label: '是否渲染组件', component: () => CodeValueInput, componentProps: {
                expectedValueType: 'boolean',
                defaultValue: true,
                defaultCode: `return true`,
                renderParams: props.renderParams,
            }, tip: '默认开启，请返回boolean', colProps: { span: 4 }
        },
        {
            category: 'Container', component: 'Collapse', componentProps: ({ formValue }) => {
                const { colProps } = formValue
                console.log(Boolean)
                return {
                    title: '分栏配置',
                    defaultValue: Boolean(colProps.offset || colProps.push || colProps.pull || colProps.xs || colProps.sm || colProps.md || colProps.lg || colProps.xl,)
                }
            }, children: [
                { field: 'colProps.offset', label: 'offset', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
                { field: 'colProps.push', label: 'push', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
                { field: 'colProps.pull', label: 'pull', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
                { field: 'colProps.xs', label: 'xs', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
                { field: 'colProps.sm', label: 'sm', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
                { field: 'colProps.md', label: 'md', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
                { field: 'colProps.lg', label: 'lg', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
                { field: 'colProps.xl', label: 'xl', component: 'InputNumber', componentProps: { min: 1, max: 24 }, colProps: { span: 4 } },
            ]
        },
        {
            category: 'Container', component: 'Collapse', componentProps: ({ formValue }) => ({
                title: '输入型组件配置',
                defaultValue: Boolean(formValue.labelShow.value !== true || formValue.labelRender || formValue.labelWidth?.value || formValue.labelWidth?.code),
            }), ifShow: ({ formValue }) => {
                return formValue.category === 'Input'
            }, children: [{
                field: 'labelShow', label: '是否显示字段label', component: () => CodeValueInput, componentProps: {
                    expectedValueType: 'boolean',
                    defaultValue: true,
                    defaultCode: `return true`,
                    renderParams: props.renderParams,
                }, tip: '默认开启，请返回boolean', colProps: { span: 4 }
            },
            {
                field: 'labelWidth', label: '字段label宽度', component: () => CodeValueInput, componentProps: {
                    expectedValueType: 'number',
                    defaultCode: `return '100px'`,
                    renderParams: props.renderParams,
                }, tip: `默认参考表单字段label宽度配置，请返回CSSProperties['width']`, ifShow: ({ formValue }) => {
                    return formValue.labelShow?.value !== false
                }, colProps: { span: 4 }
            },
            {
                field: 'labelRender', label: '字段label渲染函数 ', component: () => CodeValueInput, componentProps: {
                    expectedValueType: 'VNodeChild',
                    placeholderCode: `return <div>字段名</div>`,
                    renderParams: props.renderParams,
                }, tip: '默认使用字段名称，请返回VNodeChild', ifShow: ({ formValue }) => {
                    return formValue.labelShow?.value !== false
                }, colProps: { span: 8 }
            },]
        },
        {
            category: 'Container', component: 'Collapse', componentProps: ({ formValue }) => {
                return {
                    title: '组件高级配置',
                    defaultValue: Boolean(formValue.componentProps || formValue.componentStyle || formValue.componentSlot || formValue.componentRender),
                }
            }, children: [
                {
                    field: 'componentProps', label: '组件Props', component: () => CodeValueInput, componentProps: {
                        expectedValueType: 'Recordable',
                        placeholderCode: `return  {\n}`,
                        renderParams: props.renderParams,
                    }, tip: '默认空配置，请返回Recordable', colProps: { span: 12 }
                },
                {
                    field: 'componentStyle', label: '组件Style', component: () => CodeValueInput, componentProps: {
                        expectedValueType: 'Recordable',
                        placeholderCode: `return  {\n}`,
                        renderParams: props.renderParams,
                    }, tip: '默认空配置，请返回CSSProperties', colProps: { span: 12 }
                },
                {
                    field: 'componentSlot', label: '组件插入插槽', component: () => CodeValueInput, componentProps: {
                        expectedValueType: 'Recordable',
                        placeholderCode: `return  {\ndefault: () => <div>默认插槽</div>,\ntitle: () => <div>title插槽</div>\n}`,
                        renderParams: props.renderParams,
                    }, tip: '默认空配置，请返回Recordable<() => VNodeChild>', colProps: { span: 12 }
                },
                {
                    field: 'componentRender', label: '组件渲染函数', component: () => CodeValueInput, componentProps: {
                        expectedValueType: 'Recordable',
                        placeholderCode: `return  <div>组件</div>`,
                        renderParams: props.renderParams,
                    }, tip: '警告！此设置将会覆盖原组件渲染逻辑，请返回VNodeChild', colProps: { span: 12 }
                },
            ]
        },

    ],
    beforeSubmit: (data) => {
        if (data.category === 'Input' && !data.field) {
            return Promise.reject('请输入映射字段')
        } else {
            return Promise.resolve(data)
        }
    },
    submitApi: (val) => {
        emit('submit', {
            ...val,
            label: val.category === 'Input' ? val.name : ''
        }, unref(metaRef))
    }
})

defineExpose({
    open: (schema: DynamicFormSchemaType, meta: any) => {
        metaRef.value = meta
        const formSchema = cloneDeep(schema)
        dialogFormMethods.open({
            ...formSchema,
            // label: formSchema.label ?? '',
            ifShow: formSchema.ifShow ?? { type: 'value', value: true },
            labelShow: formSchema.labelShow ?? { type: 'value', value: true },
            labelWidth: formSchema.labelWidth ?? { type: 'value', value: undefined },
            colProps: formSchema.colProps ?? { span: 24 },
        })
    }
})
</script>