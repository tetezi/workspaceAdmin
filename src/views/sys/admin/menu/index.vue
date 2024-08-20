<template>

    <div style="display: flex;justify-content: space-between">
        <div>
        </div>

        <div>
            <BasicButton :func="add">新增</BasicButton>
            <BasicButton :func="edit">编辑</BasicButton>
            <BasicButton :func="del">删除</BasicButton>
        </div>

    </div>
    <MenuTree ref="MenuTreeRef" selectType="select"></MenuTree>
    <DialogComp>
    </DialogComp>
</template>
<script lang="tsx" setup>
import { useDialog, BasicButton } from 'ttz-ui';
import { unref, ref } from 'vue';
import MenuTree from './components/MenuTree.vue'
import MenuForm from './components/MenuForm.vue'
import { message, messageBoxConfirm } from '@/utils/message';
import { getEnv } from '@/utils/env';
import { DelMenu } from '@/api/sys/menus';

const MenuTreeRef = ref()
const [DialogComp, dialogMethods] = useDialog<{ id?: UUID, parentId?: UUID }>(() => {
    const designerRef = ref()
    return {
        bodyRender: ({ id, parentId }) => {
            return <MenuForm ref={designerRef} id={id} parentId={parentId}   ></MenuForm>
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
    const data = unref(MenuTreeRef).getCurrent()

    dialogMethods.open({
        parentId: data?.id
    })
}
function edit() {
    const data = unref(MenuTreeRef).getCurrent()
    if (data) {
        dialogMethods.open({
            id: data.id,
        })
    } else {
        message('请先选择需要编辑的菜单', 'warning')
    }

}
async function del() {
    const data = unref(MenuTreeRef).getCurrent()
    if (data) {
        await messageBoxConfirm(`确定要删除${data.name}${(data.subMenus || []).length > 0 ? '及其子菜单' : ''}吗？`, { title: '提示' }, async () => {
            await DelMenu(data.id)
        })
        unref(MenuTreeRef).reloadMenuTree()
    } else {
        message('请先选择需要删除的菜单', 'warning')
    }

} 
</script>