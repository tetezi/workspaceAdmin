<template>
    <el-container style="height: 100vh">
        <el-aside width="none" :style="{
            display: 'flex', flexDirection: 'column', backgroundColor: settingStore.menu.bgColor
        }">
            <div style=" height: 36px; padding:6px 12px; cursor: pointer;display: flex;align-items: center"
                @click="goHome">
                <el-image :src="logo" style="height: 100%;"></el-image>
                <transition name="expand-shrink">
                    <div style='color: #FFFFFF; margin-left: 12px;font-weight: 600;white-space: nowrap; '
                        v-show='!settingStore.menu.collapse'>
                        {{ getMiniTitle() }}
                    </div>
                </transition>

            </div>
            <el-scrollbar>
                <Menu></Menu>
            </el-scrollbar>
        </el-aside>

        <el-container>
            <el-header :style="{ padding: '0', height: 'auto' }">
                <Header></Header>
                <Tabs></Tabs>
            </el-header>
            <el-main :style="{ padding: '0', backgroundColor: '#F0F2F5' }">
                <Content></Content>
            </el-main>
            <el-footer height="50px">
                <Foot></Foot>
                
            </el-footer>
        </el-container>
    </el-container>
</template>
<script lang="tsx" setup>
import Menu from './src/Menu.vue'
import Tabs from './src/Tabs.vue'
import Content from './src/Content.vue'
import Header from './src/Header.vue'
import Foot from './src/Foot.vue'
import logo from '@/assets/images/logo.jpg'
import { router } from '@/router'
import { PAGE } from '@/router/constant'
import { getMiniTitle } from '@/utils/env'
import { useSettingStore } from '@/stores/modules/setting';
const settingStore = useSettingStore()
// import { menuSetting } from '@/settings/base'
function goHome() {
    router.push(PAGE.home)
} 
</script>

<style scoped>
.expand-shrink-enter-active,
.expand-shrink-leave-active {
    transition: width .3s;
}

.expand-shrink-enter-from,
.expand-shrink-leave-to {
    width: 0;
}

.expand-shrink-enter-to,
.expand-shrink-leave-from {
    width: 100px;
}
</style>