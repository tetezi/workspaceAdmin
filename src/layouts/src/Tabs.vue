<template>
    <div>
        <Tabs v-model:activeKey="tabValue" type="editable-card" :tabBarGutter="2" hideAdd
            @edit="(e, action) => action === 'remove' && removeHandle(e)">
            <TabPane v-for="item in tabStore.tabs" :key="item.path" :tab="item.title"></TabPane>
            <!-- <template #rightExtra>
                <el-button-group>
                    <BasicButton text icon="Refresh" :func="refreshHandle"> </BasicButton>
                    <Dropdown>
                        <template #overlay>
                            <Menu>
                                <Menu.Item>
                                    关闭其他标签页
                                </Menu.Item>
                                <Menu.Item>
                                    关闭全部标签页
                                </Menu.Item>
                            </Menu>
                        </template>
<el-button text>
    <BasicIcon icon="ArrowDownBold"></BasicIcon>
</el-button>
</Dropdown>
</el-button-group>
</template> -->
        </Tabs>
    </div>
</template>
<script lang="ts" setup>
import { useTabStore } from '@/stores/modules/tabs';
import { computed, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Meta } from '@/router/types'
import { Tabs, TabPane, Dropdown, Menu } from 'ant-design-vue'
// import "ant-design-vue/lib/tabs/style/css";
// import "ant-design-vue/lib/dropdown/style/css";
import { BasicButton } from 'ttz-ui'
import { PAGE } from '@/router/constant';

// import "ant-design-vue/lib/menu/style/css";
// import "ant-design-vue/lib/button/style/css";
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
    if (meta.include) {
        tabStore.addTab({
            path, title: meta.title || '', include: meta.include
        })
    }

},{
    immediate:true
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
async function refreshHandle() {
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