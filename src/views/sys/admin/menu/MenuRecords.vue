<template>

    <div style="display: flex;justify-content: space-between">
        <div>
            <EasyApiSelect configLabel="Init_应用列表" v-model="appId" valueField='Id' labelField='Name' style="width:150px"
                :initAutoSelectFirst="true" :immediate="true"></EasyApiSelect>
        </div>

        <div>
            <BasicButton :func="add">新增</BasicButton>
            <BasicButton :func="edit">编辑</BasicButton>
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
import { message } from '@/utils/message';

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
        message('请先选择需要编辑的命令', 'warning')
    }

} 
</script>