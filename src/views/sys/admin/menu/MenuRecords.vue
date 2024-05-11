<template>
    <BasicButton :func="add">新增</BasicButton>
    <BasicButton :func="edit">编辑</BasicButton>
    <MenuTree :appId ref="MenuTreeRef"></MenuTree>
    <DialogComp>
    </DialogComp>
</template>
<script lang="tsx" setup>
import { useDialog, BasicButton, useApi } from 'ttz-ui';
import { unref, computed, ref } from 'vue';
import MenuTree from './components/MenuTree.vue'
import MenuForm from './components/MenuForm.vue'
import { message } from '@/utils/message';
const appId = ref('81e18504-6c61-4542-8e80-47469c51c2d0')
const MenuTreeRef = ref()
const [DialogComp, dialogMethods] = useDialog<{ id?: UUID, parentId?: UUID }>(() => {
    const designerRef = ref()
    return {
        bodyRender: ({ id, parentId }) => {
            return <MenuForm ref={designerRef} id={id} parentId={parentId} appId={unref(appId)}></MenuForm>
        },
        submitApi: async () => {
            if (unref(designerRef).submit) {
                return unref(designerRef).submit()
            } else {
                return Promise.reject()
            }
        },
        onClose: () => {
            unref(MenuTreeRef).reloadMenuTree()
        }
    }
})

function add() {
    const data = unref(MenuTreeRef).getCurrentNode()

    dialogMethods.open({
        parentId: data?.Id
    })
}
function edit() {
    const data = unref(MenuTreeRef).getCurrentNode()
    if (data) {
        dialogMethods.open({
            id: data.Id,
        })
    } else {
        message('请先选择需要编辑的命令', 'warning')
    }

} 
</script>