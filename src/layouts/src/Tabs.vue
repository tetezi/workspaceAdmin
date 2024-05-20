<template>
    <div style="border-top: 1px solid rgb(238,238,238);">
        <Tabs v-model:activeKey="tabValue" type="editable-card" :tabBarGutter="2" hideAdd size="small"
            @edit="(e, action) => action === 'remove' && removeHandle(e)">
            <TabPane :key="PAGE.home" tab="首页" :closable="false"></TabPane>
            <TabPane v-for="item in tabStore.tabs" :key="item.path" :tab="item.title"></TabPane>
            <template #rightExtra>
                <el-button-group style="margin:0 5px">
                    <BasicButton icon="Refresh" :func="refreshHandle"> </BasicButton>
                    <el-dropdown>
                        <span class="user">
                            <BasicButton icon="ArrowDownBold"> </BasicButton>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="refreshHandle">刷新当前标签页</el-dropdown-item>
                                <el-dropdown-item @click="removeOtherHandle">关闭其他标签页</el-dropdown-item>
                                <el-dropdown-item @click="removeAllHandle">关闭全部标签页</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-button-group>
            </template>
        </Tabs>
    </div>
</template>
<script lang="ts" setup>
import { useTabStore } from '@/stores/modules/tabs';
import { computed, watch, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Meta } from '@/router/types'
import { Tabs, TabPane } from 'ant-design-vue'
import { BasicButton } from 'ttz-ui'
import { PAGE } from '@/router/constant';
const tabStore = useTabStore()
const route = useRoute()
const router = useRouter()
const tabValue = computed({
    set: (path) => path !== route.path && router.push({ path }),
    get: () => route.path as string
})
watch(() => route.path, () => {
    const { path } = route
    const meta: Meta = route.meta
    if (meta.cache) {
        tabStore.setTab({
            path, title: meta.title || '', cache: meta.cache
        })
    }
}, {
    immediate: true
})
async function removeHandle(targetKey: any) {
    if (targetKey === route.path) {
        const index = tabStore.getTabIndexByPath(targetKey)
        if (index - 1 >= 0) {
            await router.push(tabStore.getTabByIndex(index - 1).path)
        } else if (index + 1 < tabStore.tabs.length) {
            await router.push(tabStore.getTabByIndex(index + 1).path)
        } else if (tabStore.tabs.length === 1) {
            await router.push(PAGE.home)
        }
    }
    tabStore.delTabByPath(targetKey)

}
async function removeOtherHandle() {
    const tab = tabStore.getTabByPath(route.path)
    if (tab) {
        tabStore.setTabs([tab])
    } else {
        await removeAllHandle()
    }
}
async function removeAllHandle() {
    tabStore.setTabs([])
    await router.push(PAGE.home)
}
async function refreshHandle() {
    tabStore.setTab({
        path: route.path, title: (route.meta.title as string), cache: false
    })
    await router.replace({
        path: '/redirect',
        query: {
            path: String(route.path),
        }
    })
    // await router.replace({
    //     path: '/redirect',
    //     query: {
    //         name: String(route.name),
    //     }
    // })

}

</script>
<style>
.ant-tabs-nav {
    margin-bottom: 0 !important
}
</style>