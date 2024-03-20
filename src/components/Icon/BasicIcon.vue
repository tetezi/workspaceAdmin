<template>
    <ElIcon :size="size" :class="props.loading ? 'is-loading' : ''">
        <component :is="icon" />
    </ElIcon>
</template>
<script lang="tsx" setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { isString } from 'lodash';
import { computed, type Component } from 'vue';
defineOptions({
    name: 'BasicIcon'
})
const props = defineProps<{
    icon: string | Component,
    size?: string | number
    loading?: boolean
}>()

const icon = computed(() => {
    if (props.loading) {
        return ElementPlusIconsVue['Loading']
    } else if (isString(props.icon)) {
        const icons: any = ElementPlusIconsVue
        return icons[props.icon]
    } else {
        return props.icon
    }
})
</script>