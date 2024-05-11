<template>
    <div style="display: flex">
        <el-input v-model="filterText" @change="search" />
        <BasicButton icon="Refresh" :func="reloadMenuTree"> </BasicButton>
    </div>

    <el-tree ref='treeRef' v-bind="treeBind" v-loading="loadingRef">
    </el-tree>
</template>
<script lang="ts" setup>
import { computed, unref, ref, watch } from 'vue';
import { BasicButton, useApi, useLocalModel } from 'ttz-ui';
import { GetAllMenu } from '@/api/sys/menus';
const props = defineProps<{
    appId: UUID
}>()
const emit = defineEmits<{
    currentChange: [data: Recordable]
}>()
// const modelValue = defineModel()
// const { setModelValue, getModelValue, localModelValue } = useLocalModel(modelValue)
const currentData = ref<Recordable>()
const { dataRef, loadingRef, fetch: reloadMenuTree } = useApi({
    api: GetAllMenu,
    immediate: true,
    defaultData: [],
    onChangeData() {
        currentData.value = undefined
    },
}, () => ({
    appId: props.appId
}))
const treeRef = ref()
const filterText = ref('')
const treeBind = computed(() => {
    return {
        nodeKey: 'Id',
        data: unref(dataRef),
        highlightCurrent: true,
        defaultExpandAll: true,
        checkOnClickNode: true,
        props: {
            label: 'Name',
            children: 'SubMenus'
        },
        filterNodeMethod: (value, data) => {
            if (!value) return true
            if (data === unref(treeRef).getCurrentNode()) {
                return true
            }
            return data.Name.includes(value)
        },
        onCurrentChange: (data) => {
            currentData.value = data
            emit('currentChange', data)
            // console.log('设置')
            // setModelValue(Id)
        }
    }
})
function search(value) {
    unref(treeRef)!.filter(value)
}
function getCurrentNode() {
    return unref(treeRef).getCurrentNode()
}
defineExpose({
    getCurrentNode, reloadMenuTree
})
</script>