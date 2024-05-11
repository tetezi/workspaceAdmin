<template>
    <FormComp v-loading="loadingRef">
    </FormComp>
</template>
<script lang="ts" setup>
import { useApi, useForm, useTable, BasicButton } from 'ttz-ui';
import { SetUserRole } from '@/api/sys/role';
import { buildUUID } from '@/utils/uuid';
import { unref } from 'vue';
const props = defineProps<
    {
        appId: UUID
        roleId: UUID
    }>()
const { loadingRef } = useApi({
    api: () => {
        return [
            { userId: '李四', userName: '李四' },
        ]
    },// GetUserRole,
    immediate: true,
    defaultData: [],
    onChangeData: (data) => {
        formMethods.setModelValue({
            UserIds: data
        })
    }
}, () => ({
    appId: props.appId,
    roleId: props.roleId
}))
const [FormComp, formMethods] = useForm(() => ({
    defaultValue: {
        UserIds: []
    },
    formSchemas: [
        {
            labelWidth: 0,
            field: 'UserIds', label: 'UserIds', component: 'TableTransfer', labelShow: false, componentProps: {
                api: () => {
                    console.log('请求所有user接口')
                    return {
                        rows: [
                            { userId: '李四', userName: '李四' },
                            { userId: `张三`, userName: '张三' },
                        ],
                        total: 2
                    }
                },
                columns,
                rowKey: 'userId',
                title: '用户列表'
            }
        },
    ],
    submitApi: (data) => {
        // SetUserRole
        console.log('提交', data)
    },
    beforeSubmit: (raw) => {
        return {
            appId: props.appId,
            userIds: raw.UserIds,
            roleId: props.roleId,
        }
    },
}))
const columns = [{
    prop: 'userId', label: 'userId',
}, { prop: 'userName', label: 'userName', }]
async function submit() {
    return await formMethods.submitFunction()
}
defineExpose({ submit })
</script>