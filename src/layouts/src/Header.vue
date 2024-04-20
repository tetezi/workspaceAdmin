<template>
    <div style="display: flex; justify-content: flex-end;">
        <el-dropdown> 
                <span class="user">
                    {{ useUserStore().user?.name }}
                </span> 
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user';
import { messageBoxConfirm, message } from '@/utils/message';
const userStore = useUserStore()

async function logout() {
    messageBoxConfirm('是否确认退出登录', {}, async () => {
        userStore.logout()
    })
}
</script>
<style scoped>
.user { 
    padding:5px 10px;
    margin:5px
}
</style>