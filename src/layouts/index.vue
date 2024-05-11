<template>
    <el-container style="height: 100vh">
        <el-aside width="none" style="display: flex;flex-direction: column;   background-color:#292D3E">
            <div style=" height: 36px; padding:6px 12px; cursor: pointer;display: flex;align-items: center"
                @click="goHome">
                <el-image :src="logo" style="height: 100%;"></el-image>
                <div style='color: #FFFFFF;flex:1;margin-left: 12px;font-weight: 600;'>
                    {{ getMiniTitle() }}
                </div>
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
        </el-container>
    </el-container>
</template>
<script lang="tsx" setup>
import Menu from './src/Menu.vue'
import Tabs from './src/Tabs.vue'
import Content from './src/Content.vue'
import Header from './src/Header.vue'
import logo from '@/assets/images/logo.png'
import { router } from '@/router'
import { PAGE } from '@/router/constant'
import { getMiniTitle } from '@/utils/env'
// import { menuSetting } from '@/settings/base'
function goHome() {
    router.push(PAGE.home)
} 
</script>