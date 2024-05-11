<template>
    <el-scrollbar :view-style="{
        height: '100%'
    }">
        <router-view v-slot="{ Component, route }">
            <keep-alive :include="tabStore.getCacheTabPaths">
                <component :is="getComponent(Component, route)" :key="route.path" />
            </keep-alive>
        </router-view>
    </el-scrollbar>
</template>
<script lang="tsx" setup>
import { useTabStore } from '@/stores/modules/tabs';
const tabStore = useTabStore()
function getComponent(component: any, route: any) {
    component.type.name = route.path
    return component
}
</script>
<style scoped>
:deep(.el-scrollbar__bar) {
    z-index: 3;
}
</style>