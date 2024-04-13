<template>
    <el-result title="403" sub-title="拒绝访问" icon="error">
        <template #extra>
            {{ route.query.tip }}
        </template>
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