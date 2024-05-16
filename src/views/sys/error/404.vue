<template>
    <el-result title="404" sub-title="页面不存在" icon="error">
        <template #extra>
            <BasicButton type="primary" :func='back'>返回主页</BasicButton>
        </template>
    </el-result>
</template>
<script lang="tsx" setup>
import { useRouter } from 'vue-router';
import { PAGE } from '@/router/constant'
import { BasicButton, } from 'ttz-ui';

const router = useRouter()
function back() {
    console.log('aa', router)
    router.replace(PAGE.home)
}
</script>