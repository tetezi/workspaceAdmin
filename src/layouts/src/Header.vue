<template>
    <div style="display: flex; justify-content:space-between;align-items: center; ">
        <div style="flex:1">
            <BasicButton v-if="!settingStore.menu.collapse" text icon="DArrowLeft"
                :func="() => { settingStore.menu.collapse = true }"> </BasicButton>
            <BasicButton v-else text icon="DArrowRight" :func="() => { settingStore.menu.collapse = false }">
            </BasicButton>
        </div>
        <component :is='()=>userStore.getUserAvatar(24)'></component>
        <el-button-group>
            <BasicButton text>
                {{ useUserStore().user?.name }}
            </BasicButton>
            <BasicButton text :func="logout">退出</BasicButton>
            <BasicButton text icon="Setting" :func="() => dialogMethods.open()"> </BasicButton>
        </el-button-group>
    </div>
    <DialogComp>
        <SettingFormComp v-model="settingStore.$state"></SettingFormComp>
    </DialogComp>
</template>
<script lang="tsx" setup>
import { useUserStore } from '@/stores/modules/user';
import { useSettingStore } from '@/stores/modules/setting';
import { messageBoxConfirm } from '@/utils/message';
import { BasicButton, useDialog, useForm } from 'ttz-ui';
import { markRaw } from 'vue';
const userStore = useUserStore()
const settingStore = useSettingStore()
const [SettingFormComp] = useForm({
    formSchemas: [

        {
            category: 'Container', component: 'Card', componentProps: { title: '菜单配置' }, children: [
                { field: ['menu', 'collapse'], label: '是否折叠', component: 'Switch' },
                {
                    field: ['menu', 'bgColor'], label: '背景颜色', component: markRaw(ElColorPicker),
                    componentProps: {
                        tabindex: 2
                    }
                },
            ]
        },
        {
            category: 'Display', component: 'BasicButton',
            componentStyle: {
                width: '100%',
            },
            componentProps: {
                type: 'primary',
                func: () => settingStore.resetting(),
                label: '重置配置'
            }
        },
    ],
})
const [DialogComp, dialogMethods] = useDialog({
    title: '项目配置',
    showActionBtns: false,
    width: 300
})
async function logout() {
    messageBoxConfirm('是否确认退出登录', { title: '提示' }, async () => {
        userStore.logout()
    })
}
</script>
<style scoped></style>