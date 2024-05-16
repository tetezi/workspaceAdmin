<template>
    <div style="background-color:#FFFFFF ;margin:12px;padding: 12px  ">
        <div>
            <component :is='()=>userStore.getUserAvatar(100)'></component>
            <span style='font-size: 1.2rem'>
                欢迎回来，{{ userStore.user?.name }}，请继续您的工作吧！
            </span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useTimestamp } from '@vueuse/core';
import { formatToDateTime } from '@/utils/day';
import { useUserStore } from '@/stores/modules/user';
const userStore = useUserStore()
const router = useRouter();
const timestamp = useTimestamp({
    interval: 1000
})
// const  = computed(()=>{
//     return dayjs(unref(timestamp)).format('YYYY-MM-DD HH:mm:ss')
// })
</script>