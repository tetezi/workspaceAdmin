<template>
    <div style="height: 100%;width:100%;display: flex;">
        <div style=" width:10%;border: 1px solid black;box-sizing: border-box">

            <PreinstallFormSchemas> </PreinstallFormSchemas>

        </div>
        <div style="height: 100%; width:65%;border: 1px solid black;box-sizing: border-box">
            <div style="height: 100%; display: flex;flex-direction: column;">
                <div style="display:flex;">
                    <BasicButton style="flex:1" :func="switchDrag" type="primary">{{ isDesign ? '关闭' : '启用' }}拖拽模式
                    </BasicButton>
                    <BasicButton style="flex:1" :func="importConfig" type="primary">导入</BasicButton>
                    <BasicButton style="flex:1" :func="exportConfig" type="success">导出</BasicButton>
                    <BasicButton style="flex:1" :func="clearConfig" type="danger">清空</BasicButton>
                </div>


                <div style=" flex:1;min-height: 0px; border-top: 1px solid black;box-sizing: border-box; ">
                    <el-scrollbar style="height: 100%;" height="100%" viewStyle="height: 100%;">
                        <FormComp style="height: 100%;" :isDesign='isDesign' :isDesignFormSchema="true">
                        </FormComp>
                    </el-scrollbar>
                </div>


            </div>

        </div>

        <div style=" width:25%;border: 1px solid black;box-sizing: border-box">
            <FormSchemaConfig v-if="selectedSchema" :selectedParentSchema :selectedSchema @submit="handleSubmit"
                @del="handleDel">
            </FormSchemaConfig>


        </div>
    </div>
</template>
<script lang="ts" setup>
import { unref, computed, watch, ref, markRaw } from 'vue';
import PreinstallFormSchemas from './components/PreinstallFormSchemas.vue';
import FormSchemaConfig from './components/FormSchemaConfig.vue';
import { cloneDeep } from 'lodash';
import { BasicButton, useForm } from 'ttz-ui';
import { useClipboard } from '@vueuse/core';
import EasyApiSelect from '@/components/EasyApiSelect/EasyApiSelect.vue'
// const props = defineProps<{}>()  
const isDesign = ref(true)
const { copy, text } = useClipboard();
const [FormComp, formMethods, isOk] = useForm({
    injectComponents: [['GetSIDataSelect', markRaw(EasyApiSelect)]]
})
const selectedSchema = computed(() => {
    return unref(isOk) ? unref(formMethods.selectedSchema) : undefined
})
const selectedParentSchema = computed(() => {
    const { schemaKey } = unref(selectedSchema) || {}
    if (schemaKey) {
        return formMethods.getParentSchema(schemaKey)

    } else {
        return undefined
    }
})
function handleSubmit(key, value) {
    formMethods.updateSchema(key, cloneDeep(value))
}
function handleDel(key) {
    formMethods.removeSchema(key)
}
function switchDrag() {
    isDesign.value = !unref(isDesign)
}
function importConfig() {
    // 处理粘贴板中的文本内容
    try {
        const val = JSON.parse(unref(text))
        formMethods.setSchemas(val)
    } catch (e) {
        console.error('导入失败', e)
    }
}
async function exportConfig() {
    console.log(unref(formMethods.getSchemas))
    copy(JSON.stringify(unref(formMethods.getSchemas)))
}
function clearConfig() {
    formMethods.setSchemas([])
} 
</script>
