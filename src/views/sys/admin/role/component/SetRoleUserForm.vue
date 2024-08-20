<template>
    <FormComp v-loading="loadingRef">
    </FormComp>
</template>
<script lang="ts" setup>
import { useApi, useForm } from 'ttz-ui';
import { SetRoleUser } from '@/api/sys/role';
import { computed, unref } from 'vue';
import { GetSIData } from '@/api/sys/interface';
import { easyApiMap } from '@/utils/http/easyApiMap';
import { isArray } from 'element-plus/es/utils/types.mjs';
const props = defineProps<
    {
        roleId: UUID
    }>()
const { dataRef: unSelectedData, loadingRef: unSelectedDataLoadingRef } = useApi({
    api: async (params) => {
        return await GetSIData(easyApiMap['权限_角色未配置用户'], params)
    },
    resultField: 'rows',
    immediate: true,
    defaultData: [] as Recordable[],
}, () => ({
    roleId: props.roleId
}))
const { loadingRef: selectedDataLoadingRef } = useApi({
    api: async (params) => {
        return await GetSIData(easyApiMap['权限_角色已分配用户'], params)
    },
    resultField: 'rows',
    immediate: true,
    defaultData: [] as Recordable[],
    onChangeData: (data) => {
        formMethods.setModelValue({
            UserIds: isArray(data) ? data : []
        })
    }
}, () => ({
    roleId: props.roleId
}))
const loadingRef = computed(() => {
    return unref(unSelectedDataLoadingRef) || unref(selectedDataLoadingRef)
})
const [FormComp, formMethods] = useForm(() => ({
    defaultValue: {
        UserIds: []
    },
    formSchemas: [
        {
            labelWidth: '0px',
            field: 'UserIds', label: 'UserIds', component: 'TableTransfer', labelShow: false,
            componentProps: {

                unSelectedData: unref(unSelectedData) as any,
                columns: [
                    { prop: 'Name', label: 'Name', },
                    { prop: 'UserNo', label: 'UserNo', }
                ],
                rowKey: 'UserId',
                title: '用户列表'
            }
        },
    ],
    submitApi: async ({ UserIds }) => {
        return await SetRoleUser({
            roleId: props.roleId,
        }, (UserIds || []).map(({ UserId }) => UserId))
    },
}))
async function submit() {
    return await formMethods.submitFunction()
}
defineExpose({ submit })
</script>