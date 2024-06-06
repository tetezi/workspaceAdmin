<template>
    <div ref="editorContainer" style="height: 100%;width:100%">
    </div>
</template>
<script lang="tsx" setup>
import { onMounted, ref, unref, watch, onUnmounted } from 'vue';
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
const props = withDefaults(defineProps<{
    language?:
    | "json"
    | "css"
    | "scss"
    | "less"
    | "html"
    | "handlebars"
    | "razor"
    | "typescript"
    | "javascript";
}>(), { language: 'typescript' })
const modelValue = defineModel<string>()
const editorContainer = ref<HTMLElement | null>(null)
let editInstance
// monaco.languages.typescript.javascriptDefaults.addExtraLib(`const val = '1'`);
// fetch('ttz-ui/typescript.d.ts').then((res) => {
monaco.languages.typescript.typescriptDefaults.addExtraLib(`const renderParams:{
    formValue: Readonly<Recordable>;
    schema:FormSchema;
    compValue: WritableComputedRef<any>;

    setProps: SetProps;
    getProps: GetFormProps;
    getModelValue: ComputedRef<any>;
    setModelValue: (val: any) => void;
    setFieldsValue: (key: PropertyPath, val: any) => void;
    getFieldsValue: (key: PropertyPath) => any;
    validate: Validate;
    submitFunction: SubmitFunction;
    getSubmitLoading: GetSubmitLoading;
    initDefaultValue: () => void;
    updateSchema: UpdateSchema;
    setSchemas: SetSchemas;
    getSchema: GetSchema;
    selectSchema:SelectSchema,
    isSelectedSchema:IsSelectedSchema
    getFormItemInstance: GetFormItemInstance;
}   = null as any `);
onMounted(() => {

    self.MonacoEnvironment = {
        getWorker(_, label) {
            let worker = new editorWorker()
            if (label === 'json') {
                worker = new jsonWorker()
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
                worker = new cssWorker()
            }
            if (label === 'html' || label === 'handlebars' || label === 'razor') {
                worker = new htmlWorker()
            }
            if (label === 'typescript' || label === 'javascript') {
                worker = new tsWorker()
            }
            return worker
        }
    }

    editInstance = monaco.editor.create(unref(editorContainer) as HTMLElement, {
        // value: unref(modelValue), // 编辑器的值
        // language: props.language, //语言
        model: monaco.editor.createModel(unref(modelValue), 'typescript'),
        theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark
        // autoIndent: true, // 自动缩进
        readOnly: false, // 是否只读 
    });
    // 监听编辑器的内容修改事件 
    editInstance.onDidChangeModelContent((event) => {
        const newValue = unref(editInstance).getValue()
        modelValue.value = newValue;
    });
    watch(modelValue, (newValue) => {
        if ((editInstance).getValue() !== newValue) {
            editInstance.setValue(newValue);
        }
    })
})
onUnmounted(() => {
    editInstance?.dispose();
});
</script>