<template>
    <div style="display: flex">
        <el-input v-model="filterText" @change="search" placeholder='输入菜单名称搜索' />
        <BasicButton icon="Refresh" :func="reloadMenuTree" tip='刷新菜单'> </BasicButton>
    </div>
    <el-tree ref='treeRef' v-bind="treeBind" v-loading="loadingRef">
    </el-tree>
</template>
<script lang="ts" setup>
import { computed, unref, ref, nextTick } from 'vue';
import { BasicButton, useApi } from 'ttz-ui';
import { GetAllMenu } from '@/api/sys/menus';
import { onClickOutside } from '@vueuse/core';
import { getEnv } from '@/utils/env';
const props = defineProps<{
    selectType: 'check' | 'select'
}>()
// const appId = getEnv("VITE_APP_ID")
async function reloadMenuTree() {
    filterText.value = ''
    await fetch()
}
const { dataRef, loadingRef, fetch } = useApi({
    api: GetAllMenu,
    immediate: true,
    defaultData: [],
}, {})
const treeRef = ref()
const filterText = ref('')
const treeBind = computed(() => {
    return {
        nodeKey: 'id',
        data: unref(dataRef),
        highlightCurrent: props.selectType === 'select',
        defaultExpandAll: true,
        checkOnClickNode: true,
        showCheckbox: props.selectType === 'check',
        props: {
            label: 'name',
            children: 'subMenus'
        },
        filterNodeMethod: (value, data) => {
            if (!value) return true
            if (data === unref(treeRef).getCurrentNode()) {
                return true
            }
            return data.name.includes(value)
        },
    }
})
onClickOutside(treeRef, () => {
    if (props.selectType === 'select') {
        setTimeout(() => {
            unref(treeRef)?.setCurrentKey(null)
        }, 100);
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