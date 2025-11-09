<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-06-15 14:51:33
 * @LastEditors: tetezi MaHouShouJoTetezi@foxmail.com
 * @LastEditTime: 2025-11-09 15:45:36
 * @FilePath: \workspaceAdmin\src\views\home.vue
 * @Description: 
 * 
-->
<template>
  <div style="height: 100%; box-sizing: border-box; padding: 12px">
    <div style="background-color: #ffffff; padding: 12px">
      <component :is="() => userStore.getUserAvatar(100)"></component>
      <span style="font-size: 1.2rem">
        欢迎回来，{{ userStore.user?.name }}，请继续您的工作吧！
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
</script>
