<template>
    <!-- <FormComp v-loading="loadingRef">
    </FormComp> -->
    <div v-loading="loadingRef">
        <UserTableComp />
    </div>
</template>
<script lang="ts" setup>
import { useApi, useTable, } from 'ttz-ui';
import { AssignUsersToRole, GetRoleUsersByRoleId, RemoveUsersFromRole, } from '@/api/sys/role';
import { GetAllUsers } from '@/api/sys/user';
import { unref } from 'vue';
const props = defineProps<
    {
        roleId: UUID
    }>()
const [UserTableComp, userTableMethods] = useTable({
    rowKey: 'id',
    api: (params, pageParams) => GetAllUsers(pageParams),
    immediate: true,
    columns: [
        { prop: 'userNo', label: '工号', },
        { prop: 'name', label: '姓名', },
        { prop: 'email', label: '邮箱', },
        { prop: 'phone', label: '电话', },
    ],
    selectType: 'Check',
    /**
     * TODO: 选择调接口 用户连到角色，反之断开
     */
    onUnSelectRow: async (row) => {
        await RemoveUsersFromRole({ id: props.roleId, userIds: [row.id] })
        reloadRoleUsers()
    },
    onSelectRow: async (row) => {
        const isInRole = unref(roleUsers).some((roleUser) => { return roleUser.userId === row.id })
        if (!isInRole) {
            await AssignUsersToRole({ id: props.roleId, userIds: [row.id] })

        }
        reloadRoleUsers()
    }
})
const { loadingRef, dataRef: roleUsers, fetch: reloadRoleUsers } = useApi({
    api: GetRoleUsersByRoleId,
    immediate: true,
    defaultData: [] as Recordable[],
    onChangeData: async (data) => {
        await userTableMethods.setSelectRows((data || []))
    }
}, () => ({
    id: props.roleId
})) 
</script>