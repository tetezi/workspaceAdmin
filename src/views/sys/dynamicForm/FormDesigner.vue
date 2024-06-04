<template>
    <el-row style="height: 100%;box-sizing: border-box">
        <el-col :span="3" style=" border: 1px solid black;box-sizing: border-box">
            <PreinstallFormSchemas> </PreinstallFormSchemas>
        </el-col>
        <el-col :span="12" style=" border: 1px solid black;box-sizing: border-box">
            <FormComp :isDesign='true' :isDesignFormSchema="true" :formSchemas="[]" style="height: 100%; ">
            </FormComp>
        </el-col>

        <el-col :span="9" style=" border: 1px solid black;box-sizing: border-box">
            <FormSchemaConfig v-if="selectedSchema" :selectedSchema="selectedSchema" @submit="handleSubmit"
                @del="handleDel">
            </FormSchemaConfig>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { unref, computed } from 'vue';
import PreinstallFormSchemas from './components/PreinstallFormSchemas.vue';
import FormSchemaConfig from './components/FormSchemaConfig.vue';
import { cloneDeep } from 'lodash';
import { useForm } from 'ttz-ui';
const props = defineProps<{}>()
const [FormComp, formMethods, isOk] = useForm({})
const selectedSchema = computed(() => {
    return unref(isOk) ? unref(formMethods.selectedSchema) : undefined
})
const allSchema = computed(() => {
    return unref(isOk) ? unref(formMethods.getFormSchemas) : undefined
})
function handleSubmit(key, value) {
    formMethods.updateSchema(key, cloneDeep(value))
}
function handleDel(key) {
    formMethods.removeSchema(key)
}
</script>
