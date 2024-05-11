<template>
    <Records :tableId :columns :title :designer="RoleDesigner" :actionColumn ref="recordsRef"></Records>
    <SetUserRoleDialogComp />
</template>
<script lang="tsx" setup>
import Records from './Records.vue';
import { BasicButton, useDialog, useForm, type TableColumn } from 'ttz-ui';
import RoleDesigner from '../designer/RoleDesigner.vue';
import { computed, ref } from 'vue';
import { unref } from 'vue';
import { SetUserRole } from '@/api/sys/role';
import SetUserRoleForm from '../component/SetUserRoleForm.vue';
const tableId = '193fc4e9-6956-4578-8cbf-46549c842484'
const appId = ``
const title = `角色配置表`
const recordsRef = ref()
const [SetUserRoleDialogComp, setUserRoleDialogMethods] = useDialog<{
    appId: UUID,
    roleId: UUID
}>(() => {
    const formRef = ref()
    return {
        width: '90%',
        submitApi: () => unref(formRef).submit(),
        onClose: () => {
            unref(recordsRef).reload()
        },
        bodyRender: (data) => {
            return <SetUserRoleForm {...data} ref={formRef}> </SetUserRoleForm>
        },
        alignCenter: true,
        title: `设置角色-${''}`,
    }
})
const columns: TableColumn<Recordable>[] = [
    // { prop: 'Id', label: 'id' },
    { prop: 'No', label: '编号' },
    { prop: 'AppId', label: 'AppId' },
    { prop: 'Name', label: '名称' },
]
const actionColumn = computed(() => (row) => {
    return <BasicButton func={() => {
        setUserRoleDialogMethods.open({
            appId: row.AppId,
            roleId: row.Id,
        })
    }}>设置用户</BasicButton>
}) 
</script>