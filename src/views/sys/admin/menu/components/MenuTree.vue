<template>
    <div style="display: flex">
        <el-input v-model="filterText" @change="search" />
        <BasicButton icon="Refresh" :func="reloadMenuTree"> </BasicButton>
    </div>

    <el-tree ref='treeRef' v-bind="treeBind" v-loading="loadingRef">
    </el-tree>
</template>
<script lang="ts" setup>
import { computed, unref, ref } from 'vue';
import { BasicButton, useApi } from 'ttz-ui';
import { GetAllMenu } from '@/api/sys/menus';
const props = defineProps<{
    appId: UUID
    selectType: 'check' | 'select'
}>()
const { dataRef, loadingRef, fetch: reloadMenuTree } = useApi({
    api: GetAllMenu,
    immediate: true,
    defaultData: [],
}, () => ({
    appId: props.appId
}))
const treeRef = ref()
const filterText = ref('')
const treeBind = computed(() => {
    return {
        nodeKey: 'Id',
        data: unref(dataRef),
        highlightCurrent: props.selectType === 'select',
        defaultExpandAll: true,
        checkOnClickNode: true,
        showCheckbox: props.selectType === 'check',
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
    }
})
function search(value) {
    unref(treeRef)!.filter(value)
}
function getCurrent() {
    return unref(treeRef).getCurrentNode()
}
function getChecked() {
    return [...unref(treeRef).getCheckedNodes(), ...unref(treeRef).getHalfCheckedNodes()]
}
function setChecked(keys) {
    return unref(treeRef).setCheckedKeys(keys, true)
}
defineExpose({
    getCurrent, getChecked, setChecked, reloadMenuTree
})
</script>