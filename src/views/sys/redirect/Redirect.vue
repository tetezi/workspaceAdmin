<template>
    <div>asd</div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
 route.query.path && router.replace({ path: String(route.query.path) })
</script>