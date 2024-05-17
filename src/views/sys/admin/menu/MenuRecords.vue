<template>

    <div style="display: flex;justify-content: space-between">
        <div>
            <EasyApiSelect configLabel="Init_应用列表" v-model="appId" valueField='Id' labelField='Name' style="width:150px"
                :initAutoSelectFirst="true" :immediate="true"></EasyApiSelect>
        </div>

        <div>
            <BasicButton :func="add">新增</BasicButton>
            <BasicButton :func="edit">编辑</BasicButton>
            <BasicButton :func="del">删除</BasicButton>
        </div>

    </div>
    <MenuTree v-if="appId" :appId="appId" ref="MenuTreeRef" selectType="select"></MenuTree>
    <DialogComp>
    </DialogComp>
</template>
<script lang="tsx" setup>
import { useDialog, BasicButton } from 'ttz-ui';
import { unref, ref } from 'vue';
import MenuTree from './components/MenuTree.vue'
import MenuForm from './components/MenuForm.vue'
import { message, messageBoxConfirm } from '@/utils/message';
import { DelTableRecord } from '@/api/sys/form';

const appId = ref<UUID>()
const MenuTreeRef = ref()
const [DialogComp, dialogMethods] = useDialog<{ id?: UUID, parentId?: UUID }>(() => {
    const designerRef = ref()
    return {
        bodyRender: ({ id, parentId }) => {
            const _appId = unref(appId)
            return _appId ? <MenuForm ref={designerRef} id={id} parentId={parentId} appId={_appId}></MenuForm> : ''
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
        parentId: data?.Id
    })
}
function edit() {
    const data = unref(MenuTreeRef).getCurrent()
    if (data) {
        dialogMethods.open({
            id: data.Id,
        })
    } else {
        message('请先选择需要编辑的菜单', 'warning')
    }

}
function del() {
    const data = unref(MenuTreeRef).getCurrent()
    if (data) {
        messageBoxConfirm(`确定要删除${data.Name}${(data.SubMenus || []).length > 0 ? '及其子菜单' : ''}吗？`, { title: '提示' }, async () => {
            await DelTableRecord(data.Id)
        })
    } else {
        message('请先选择需要删除的菜单', 'warning')
    }

} 
</script>