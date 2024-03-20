<template>
    <el-result title="401" sub-title="当前账户未登录" icon="error">
    </el-result>
</template>
<script lang="tsx" setup>
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
watchEffect(() => {
    console.log(route)
})
</script>