<template>
    <div style="height: 100%;box-sizing: border-box;padding:8px  ">
        <RoleTableComp style="padding:8 16px">
        </RoleTableComp>
        <SaveRoleDialogComp>
        </SaveRoleDialogComp>
    </div>

    <SetRoleUserDialogComp />
    <SetRoleMenuDialogComp />
</template>
<script lang="tsx" setup>
import { BasicButton, useDialog, useTable, type TableColumn } from 'ttz-ui';
import { computed, ref } from 'vue';
import { unref } from 'vue';
import SetRoleUserForm from './component/SetRoleUserForm.vue';
import SetRoleMenuForm from './component/SetRoleMenuForm.vue';
import RoleForm from './component/RoleForm.vue';
import { DelRole, GetRoles } from '@/api/sys/role';
import { messageBoxConfirm } from '@/utils/message';


const [RoleTableComp, roleTableMethods] = useTable<Recordable>({
    columns: [
        { prop: 'name', label: '名称' },
        { prop: 'description', label: '备注' },
    ],
    api: async (_params, pageParams) => {
        const res = await GetRoles(pageParams)
        return res
    },
    actionColumn: {
        width: 230,
        formatter: (row) => {
            return <div>
                <BasicButton func={() => edit(row)}>编辑</BasicButton>
                <BasicButton func={() => del(row)} type='danger'>删除</BasicButton>
                <BasicButton func={() => {
                    setUserRoleDialogMethods.open({
                        roleId: row.id,
                    })
                }} type='primary'>设置用户</BasicButton>
                <BasicButton func={() => {
                    setRoleMenuDialogMethods.open({
                        roleId: row.id,
                    })
                }} type='success'>设置菜单</BasicButton>
            </div>
        }
    },
    headerActionRender: <BasicButton func={add} type='primary'>新增</BasicButton>,
    title: `角色配置表`,
})

const [SaveRoleDialogComp, saveRoleDialogMethods] = useDialog<string>(() => {
    const dataDesignerRef = ref()
    return {
        width: '90%',
        submitApi: async () => {
            if (unref(dataDesignerRef).submit) {
                return unref(dataDesignerRef).submit()
            } else {
                return Promise.reject()
            }
        },
        onClose: () => {
            roleTableMethods.reload()
        },
        bodyRender: (id) => {
            const style = {
                maxHeight: '85vh', overflow: 'auto'
            }
            return <RoleForm id={id} ref={dataDesignerRef} style={style} />

        },
        alignCenter: true,
        destroyOnClose: true,
        title: `角色配置`,
    }
})
const [SetRoleUserDialogComp, setUserRoleDialogMethods] = useDialog<{
    roleId: UUID
}>(() => {
    const formRef = ref()
    return {
        width: '90%',
        submitApi: async () => unref(formRef).submit(),
        onClose: () => {
            roleTableMethods.reload()
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
}>(() => {
    const formRef = ref()
    return {
        width: '90%',
        submitApi: async () => unref(formRef).submit(),
        onClose: () => {
            roleTableMethods.reload()
        },
        bodyRender: (data) => {
            return <SetRoleMenuForm {...data} ref={formRef}> </SetRoleMenuForm>
        },
        alignCenter: true,
        title: `设置角色菜单-${''}`,
    }
})

async function add() {
    saveRoleDialogMethods.open(undefined)
}
async function edit(row) { 
    saveRoleDialogMethods.open(row.id)
}
async function del(row) {
    await messageBoxConfirm(`确定要删除该记录吗？`, { title: '提示' }, async () => {
        await DelRole(row.id)
    })
    roleTableMethods.reload()
}
</script>