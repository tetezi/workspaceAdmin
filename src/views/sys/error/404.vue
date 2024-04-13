<template>
    <el-result title="404" sub-title="页面不存在" icon="error"> 
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