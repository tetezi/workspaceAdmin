<template>
    <div style="background-color:#FFFFFF ;margin:12px;padding: 12px  ">
        <div>
            <component :is='() => userStore.getUserAvatar(100)'></component>
            <span style='font-size: 1.2rem'>
                欢迎回来，{{ userStore.user?.name }}，请继续您的工作吧！
            </span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user';
const userStore = useUserStore()
// const  = computed(()=>{
//     return dayjs(unref(timestamp)).format('YYYY-MM-DD HH:mm:ss')
// })
</script>