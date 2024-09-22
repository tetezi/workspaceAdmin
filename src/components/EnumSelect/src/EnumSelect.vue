<template>
    <Select v-bind="bind"></Select>
</template>
<script lang="ts" setup>
import { GetEnumCategory, type EnumDetailType } from '@/api/sys/enum';
import { Select } from 'ttz-ui';
import { computed, onMounted, ref, unref, useAttrs, watchEffect } from 'vue';
defineOptions({
    inheritAttrs: false,
})
const props = defineProps<{
    categoryName: string
}>()
const attrs = useAttrs()
const bind = computed(() => ({
    ...attrs,
    options: unref(optionsRef),
    labelField: 'name',
    valueField: 'value',
}))
const optionsRef = ref<EnumDetailType[]>([])
onMounted(() => {
    watchEffect(async () => {
        if (props.categoryName) {
            optionsRef.value = (await GetEnumCategory(props.categoryName)).details
        } else {
            return Promise.reject(`categoryName未传入`)
        }
    })
})
</script>