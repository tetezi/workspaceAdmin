<template>
  <RouterView></RouterView>
</template>
<script lang="tsx" setup>
import { RouterView } from "vue-router";
import { useTitle } from "./hooks/useTitle";
useTitle()
</script>
