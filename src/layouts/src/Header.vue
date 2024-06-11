<template>
    <div style="display: flex; justify-content:space-between;align-items: center; ">
        <div style="flex:1">
            <BasicButton v-if="!settingStore.menu.collapse" text icon="DArrowLeft"
                :func="() => { settingStore.menu.collapse = true }"> </BasicButton>
            <BasicButton v-else text icon="DArrowRight" :func="() => { settingStore.menu.collapse = false }">
            </BasicButton>
        </div>
        <component :is='() => userStore.getUserAvatar(24)'></component>

        <el-dropdown style="margin:0  5px">
            <span>
                {{ useUserStore().user?.name }}
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click='logout'>
                        退出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <BasicButton text icon="Setting" tip="设置" :func="() => dialogMethods.open()"> </BasicButton>
        <BasicButton text :icon="iconsFullscreen" :func="toggle" tip="全屏"> </BasicButton>
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
import { useFullscreen } from '@vueuse/core'
import iconsFullscreen from '@/assets/icons/Fullscreen.svg'
import { ElColorPicker } from 'element-plus';
const userStore = useUserStore()
const settingStore = useSettingStore()
const { toggle } = useFullscreen()

const [SettingFormComp] = useForm({
    formSchemas: [

        {
            category: 'Container', component: 'Card', componentProps: { title: '菜单配置' }, children: [
                { field: ['menu', 'collapse'], label: '是否折叠', component: 'Switch' },
                {
                    field: ['menu', 'bgColor'], label: '背景颜色', component: () => (ElColorPicker)
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