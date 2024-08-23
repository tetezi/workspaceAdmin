<template>
    <MenuTree ref="MenuTreeRef" selectType="check"></MenuTree>
</template>
<script lang="ts" setup>
import { useApi } from 'ttz-ui';
import { ref, unref } from 'vue';
import MenuTree from '../../menu/components/MenuTree.vue'
import { GetMenusByRoleId, SetRoleMenus } from '@/api/sys/role';
const MenuTreeRef = ref()
const props = defineProps<{
    roleId: UUID
}>()
async function submit() {
    const checkedMenu = unref(MenuTreeRef).getChecked() 
    return await SetRoleMenus({
        id: props.roleId,
        menuIds: (checkedMenu || []).map(({ id }) => id)
    },)
}
useApi({
    api: GetMenusByRoleId,
    immediate: true,
    defaultData: [],
    onChangeData: (rows: any) => {
        console.log('rows', rows)
        const keys = (rows || []).map(({ id }) => id)
        // console.log(111, data, )
        unref(MenuTreeRef)?.setChecked(keys)
    }
}, {
    id: props.roleId
})
defineExpose({ submit })
</script>