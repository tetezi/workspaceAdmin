<template>
    <el-container style="height: 100vh">
        <el-aside width="200px">
            <el-scrollbar :style="{
                backgroundColor: '#292D3E'
            }">
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
// import { menuSetting } from '@/settings/base'
</script>