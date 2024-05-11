<template>
    <div style="display: flex; justify-content: flex-end; ">
        <span class="user">
            <el-button-group>
                <BasicButton text> {{ useUserStore().user?.name }}</BasicButton>
                <BasicButton text :func="logout">退出</BasicButton>
            </el-button-group>
        </span>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user';
import { messageBoxConfirm } from '@/utils/message';
import { BasicButton } from 'ttz-ui';
const userStore = useUserStore()

async function logout() {
    messageBoxConfirm('是否确认退出登录', { title: '提示' }, async () => {
        userStore.logout()
    })
}
</script>
<style scoped></style>