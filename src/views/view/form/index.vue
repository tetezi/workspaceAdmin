<template>
    <div style="height: 100%;box-sizing: border-box;padding:8px" v-loading="loadingRef">
        <template v-if="dynamicFormViewCompRef">
            <FormComp ref="FormCompRef" :title="dynamicFormViewCompRef.name"
                :formSourceType="dynamicFormViewCompRef.formSourceType" :viewCompMethods
                :dynamicFormId="dynamicFormViewCompRef.dynamicFormId" :submitFunc="submitFunc">
            </FormComp>
            <TableComp ref="TableCompRef" style="padding:8 16px" :title="dynamicFormViewCompRef.name" :viewCompMethods
                :dataSourceType="dynamicFormViewCompRef.dataSourceType" :columns="dynamicFormViewCompRef.columns"
                :dynamicTableId="dynamicFormViewCompRef.dynamicTableId" :add="addFunc" :edit="editFunc" :del="delFunc">
            </TableComp>
        </template>
        <template v-else>
            <el-result title="页面组件不存在" sub-title="请联系管理员" icon="error">
            </el-result>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { GetDynamicFormViewComp } from '@/api/sys/dynamic/formViewComp';
import { computed, ref, unref, watchEffect } from 'vue';
import TableComp from './components/table/index.vue';
import FormComp from './components/form/index.vue';
const testId = `1e4c8628-e712-4557-a07d-b20a6b58c748`
const props = defineProps<{
    dynamicFormViewCompId?: UUID
}>()
const loadingRef = ref(false)
const dynamicFormViewCompRef = ref()
const FormCompRef = ref()
const TableCompRef = ref()
watchEffect(async () => {
    if (testId) {
        loadingRef.value = true
        dynamicFormViewCompRef.value = await GetDynamicFormViewComp(testId).finally(() => { loadingRef.value = false }).then((res) => {
            return { ...res, columns: JSON.parse(res.columns) }
        })
    }
})
function addFunc() {
    unref(FormCompRef).open({})
}
async function editFunc(row) {
    const data = await unref(TableCompRef).getRecored(row.id)
    unref(FormCompRef).open(data)
}
async function delFunc(row) {
    await unref(TableCompRef).delRecored(row.id)
    unref(TableCompRef).reload()
}
async function submitFunc(data) {
    await unref(TableCompRef).saveRecored(data)
    unref(TableCompRef).reload()
}
const viewCompMethods = {}

</script>