<template>
  <el-config-provider :locale="zhCn" :zIndex="3000">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="tsx" setup>
import { useTitle } from "./hooks/useTitle";
import zhCn from 'element-plus/es/locale/lang/zh-cn'
useTitle() 
</script>
