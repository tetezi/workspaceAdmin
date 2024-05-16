<template>
    <Records :tableId :columns :title :designer="RoleDesigner" :actionColumn ref="recordsRef"></Records>
    <SetRoleUserDialogComp />
    <SetRoleMenuDialogComp />
</template>
<script lang="tsx" setup>
import Records from './Records.vue';
import { BasicButton, useDialog, useForm, type TableColumn } from 'ttz-ui';
import RoleDesigner from '../designer/RoleDesigner.vue';
import { computed, ref } from 'vue';
import { unref } from 'vue';
import SetRoleUserForm from '../component/SetRoleUserForm.vue';
import SetRoleMenuForm from '../component/SetRoleMenuForm.vue';
const tableId = '193fc4e9-6956-4578-8cbf-46549c842484'
const title = `角色配置表`
const recordsRef = ref()
const [SetRoleUserDialogComp, setUserRoleDialogMethods] = useDialog<{
    roleId: UUID
}>(() => {
    const formRef = ref()
    return {
        width: '90%',
        submitApi: async () => unref(formRef).submit(),
        onClose: () => {
            unref(recordsRef).reload()
        },
        bodyRender: (data) => {
            return <SetRoleUserForm {...data} ref={formRef}> </SetRoleUserForm>
        },
        alignCenter: true,
        title: `设置角色用户-${''}`,
    }
})
const [SetRoleMenuDialogComp, setRoleMenuDialogMethods] = useDialog<{
    roleId: UUID
    appId: UUID
}>(() => {
    const formRef = ref()
    return {
        width: '90%',
        submitApi: async () => unref(formRef).submit(),
        onClose: () => {
            unref(recordsRef).reload()
        },
        bodyRender: (data) => {
            return <SetRoleMenuForm {...data} ref={formRef}> </SetRoleMenuForm>
        },
        alignCenter: true,
        title: `设置角色菜单-${''}`,
    }
})
const columns: TableColumn<Recordable>[] = [
    // { prop: 'Id', label: 'id' },
    { prop: 'No', label: '编号' },
    { prop: 'AppId', label: 'AppId' },
    { prop: 'Name', label: '名称' },
]
const actionColumn = computed(() => (row) => {
    return [<BasicButton func={() => {
        setUserRoleDialogMethods.open({
            roleId: row.Id,
        })
    }}>设置用户</BasicButton>,
    <BasicButton func={() => {
        setRoleMenuDialogMethods.open({
            roleId: row.Id,
            appId: row.AppId,
        })
    }}>设置菜单</BasicButton>]
}) 
</script>