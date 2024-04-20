<template>
    <div></div>
    <el-dropdown>

        <div>

            <span class="user">
                {{ userStore.user?.name }}
            </span>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user';
import { messageBoxConfirm, message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';
const userStore = useUserStore()
async function logout() {
    messageBoxConfirm('是否确认退出登录', {}, async () => {
        // await userStore.logout()
    })
}
</script>
<style scoped>
.user {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>