<template>
    <el-scrollbar>
        <router-view v-slot="{ Component, route }">
            <keep-alive :include="tabStore.getTabPaths">
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