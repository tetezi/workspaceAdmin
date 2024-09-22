<template>
    <DialogComp>
        <template #default="data">
            <div style="width: 100%;display: flex;">
                <BasicButton :func="previewFrom" type="primary" style="flex:1">预览表单</BasicButton>
                <BasicButton :func="showFormConfig" type="success" style="flex:1">查看配置</BasicButton>
            </div>
            <el-tabs v-model="activeTab" type="border-card">
                <el-tab-pane label="主要配置" name="main">
                    <FormComp :defaultValue="omit(data, 'schemas')"
                        style="height: 500px;padding: 1px;box-sizing: border-box;"></FormComp>
                </el-tab-pane>
                <el-tab-pane label="表单项配置" name="schema">
                    <SchemasEditorComp v-model="schemasRef" style="height:  500px;"
                        :renderParams="[...formItemRenderParams, formMethodsRenderParams]"></SchemasEditorComp>
                </el-tab-pane>

            </el-tabs>
            <Preview ref=PreviewRef></Preview>
        </template>

    </DialogComp>
</template>
<script lang="tsx" setup>
import { SaveDynamicForm } from '@/api/sys/dynamic/form';
import { AceEditor, BasicButton, useDialog, useForm } from 'ttz-ui';
import SchemasEditorComp from './SchemasEditor.vue'
import { ref, unref } from 'vue';
import { omit } from 'lodash';
import Preview from './Preview.vue'
import { message, messageBox } from '@/utils/message';
import CodeValueInput from './CodeValueInput.vue'
import type { DynamicFormType } from '@/components/DynamicFormDialog/types';

const formItemRenderParams = [
    { label: 'schema', code: 'renderParams.schema', p: '当前渲染的schema', children: [] },
    { label: 'formValue', code: 'renderParams.formValue', p: '当前只读表单值', children: [] },
    { label: 'compValue', code: 'unref(renderParams.compValue)', p: '当前表单输入项双向绑定值', children: [] },

]
const formMethodsRenderParams = {
    label: 'formMethods', code: 'renderParams.formMethods', p: '表单操作函数', children: [
        { label: 'setProps', code: 'renderParams.formMethods.setProps(\t)', p: '设置表单Props', type: ``, children: [] },
        { label: 'getProps', code: 'unref(renderParams.formMethods.getProps)', p: '获取表单Props(ComputedRef)', type: ``, children: [] },
        { label: 'setModelValue', code: 'renderParams.formMethods.setModelValue(\t)', p: '设置表单值', type: `(val: any) => void`, children: [] },
        { label: 'getModelValue', code: 'unref(renderParams.formMethods.getModelValue)', p: '设置表单值(ComputedRef)', type: `ComputedRef<any>`, children: [] },
        { label: 'setFieldsValue', code: 'renderParams.formMethods.setFieldsValue(\t)', p: '设置表单输入子项值', type: `(key: PropertyPath, val: any) => void`, children: [] },
        { label: 'getFieldsValue', code: 'renderParams.formMethods.getFieldsValue(\t)', p: '获取表单输入子项值', type: `(key: PropertyPath) => any`, children: [] },
        { label: 'validate', code: 'renderParams.formMethods.validate()', p: '校验表单（待开发）', type: `() => Promise<void>`, children: [] },
        { label: 'submitFunction', code: 'renderParams.formMethods.submitFunction()', p: '提交表单', type: `() => Promise<void>`, children: [] },
        { label: 'getSubmitLoading', code: 'unref(renderParams.formMethods.getSubmitLoading)', p: '获取当前表单提交loading状态(ComputedRef)', type: `ComputedRef<boolean>`, children: [] },
        { label: 'initDefaultValue', code: 'renderParams.formMethods.initDefaultValue()', p: '重置表单默认值', type: `() => void`, children: [] },
        { label: 'updateSchema', code: 'renderParams.formMethods.updateSchema(\t)', p: '更新表单子项配置', type: `(schemaKey: string,schema: Schema,isRetain?: boolean) => void`, children: [] },
        { label: 'removeSchema', code: 'renderParams.formMethods.removeSchema()', p: '删除表单子项配置', type: `(schemaKey: string) => void`, children: [] },
        //     getParentSchema: GetParentSchema<InjectParams>;
        //     setSchemas: SetSchemas<InjectParams>;
        //     getSchema: GetSchema<InjectParams>;
        //     getSchemas: GetSchemas<InjectParams>;
        //     selectSchema: SelectSchema;
        //     isSelectedSchema: IsSelectedSchema<InjectParams>; 
        { label: 'getFormItemInstance', code: 'renderParams.formMethods.getFormItemInstance(\t)', p: '获取表单子项组件实例', type: `(key: string) => ComponentPublicInstance`, children: [] },
        //     injectComponent: (name: string, component: any) => void;
    ]
}

/**
 * 预览弹窗实例
 */
const PreviewRef = ref()
/**
 * 选中标签页值
 */
const activeTab = ref('main')
/**
 * 表单子项配置双向绑定值
 */
const schemasRef = ref<any[]>([])
/**
 * 表单配置id
 */
const formConfigIdRef = ref()
/**
 * 整体弹窗hook
 */
const [DialogComp, dialogFormMethods] = useDialog<MakePartialAndRemove<DynamicFormType, "id">>({
    width: '90%',
    title: '轻代码表单配置',
    closeOnClickModal: false,
    submitApi: submitFunction,
})
/**
 * 主要配置表单hook
 */
const [FormComp, formMethods] = useForm({
    labelPosition: 'top',
    formSchemas: [
        { field: 'name', label: '名称', component: 'Input' },
        {
            field: 'defaultValue', label: '表单默认值 ', component: () => CodeValueInput, componentProps: {
                expectedValueType: 'Recordable',
                placeholderCode: `return {}`,
                renderParams: [formMethodsRenderParams]
            }, tip: '表单默认值留空默认使用空对象，请返回Recordable', colProps: { span: 12 }
        },
        {
            field: 'beforeSubmit', label: '保存前回调 ', component: () => CodeValueInput, componentProps: {
                expectedValueType: 'Function',
                placeholderCode: `return (data)=>(data)`,
                renderParams: [formMethodsRenderParams]
            }, tip: '警告！保存前回调异步钩子函数,返回参数会修改保存参数提交内容，请返回()=>Recordable|Promise<Recordable>,为空则原值保存', colProps: { span: 12 }
        }, {
            field: 'description', label: '备注', component: 'Input', componentProps: {
                type: 'textarea'
            }
        },
    ],
})
/**
 * 获取并校验当前输入的表单配置
 */
async function getFormConfig() {
    await formMethods.validate().catch((err) => {
        activeTab.value = 'main'
        return Promise.reject(err)
    })
    return ({
        ...unref(formMethods.getModelValue),
        schemas: unref(schemasRef)
    })
}
/**
 * 预览当前配置
 */
async function previewFrom() {
    const config = await getFormConfig()
    unref(PreviewRef).open(config)
}
async function showFormConfig() {
    const config = await getFormConfig()
    console.log(JSON.stringify(config), JSON.parse(JSON.stringify(config)))
    messageBox(() => <AceEditor style='height:500px;width:100%' lang='json' modelValue={JSON.stringify(config, null, 2)} > </AceEditor>, {
        width: '80%',
    })
    console.log()
}
/**
 * 提交保存方法
 */
async function submitFunction() {
    const config = await getFormConfig()
    return await SaveDynamicForm({
        ...config,
        id: unref(formConfigIdRef),
        // schemas: ['']//config.schemas.map(()=>)
    })
}
defineExpose({
    open: async (data: MakePartialAndRemove<DynamicFormType, "id">) => {

        schemasRef.value = data.schemas
        formConfigIdRef.value = data.id
        dialogFormMethods.open(omit(data, 'id'))
        // await nextTick()
        // formMethods.setModelValue(omit(data, 'schemas'))
    }
})
</script>