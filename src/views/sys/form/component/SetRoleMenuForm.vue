<template>
    <MenuTree :appId="props.appId" ref="MenuTreeRef" selectType="check"></MenuTree>
</template>
<script lang="ts" setup>
import { useApi, useForm } from 'ttz-ui';
import { ref, unref } from 'vue';
import MenuTree from '@/views/sys/admin/menu/components/MenuTree.vue'
import { SetRoleMenu } from '@/api/sys/role';
import { GetPermission } from '@/api/sys/menus';
import { GetSIData } from '@/api/sys/interface';
import { easyApiMap } from '@/utils/http/easyApiMap';
const MenuTreeRef = ref()
const props = defineProps<{
    roleId: UUID
    appId: UUID
}>()
async function submit() {
    const checkedMenu = unref(MenuTreeRef).getChecked()
    return await SetRoleMenu({
        roleId: props.roleId,

    }, (checkedMenu || []).map(({ Id }) => Id))
}
const { dataRef, loadingRef } = useApi({
    api: (params) => GetSIData(easyApiMap['权限_角色已配置菜单'], params),
    immediate: true,
    defaultData: [],
    onChangeData: ({ rows }: any) => {
        // const keys: UUID[] = []
        // function checkMenus(menus) {
        //     menus.forEach(({ Id, SubMenus }) => {
        //         if (SubMenus.length > 0) {
        //             checkMenus(SubMenus)
        //         } else {
        //             keys.push(Id)
        //         }
        //     })
        // }
        // checkMenus(data)
        // filter(({ SubMenus }) => SubMenus.length === 0).
        const keys = (rows || []).map(({ MenuId }) => MenuId)
        // console.log(111, data, )
        unref(MenuTreeRef).setChecked(keys)
    }
}, {
    roleId: props.roleId
})
defineExpose({ submit })
</script>