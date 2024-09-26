<template>
    <div style="height:100%; display: flex;justify-content: center; align-items: center; flex-direction: column;">

        <transition name="el-zoom-in-center">
            <el-text type="primary" v-if="indexRef !== -1" style="transform:translateX(-100px) ;" size="large">{{ text
                }}</el-text>
        </transition>

        <a href="https://beian.miit.gov.cn/" target="_blank" style="transform:translateX(-100px) ;">
            <el-text style="transform:translateX(-100px) ;" size="large">粤ICP备2022086009号</el-text>
        </a>


    </div>
</template>
<script lang="ts" setup>
import { GetDynamicTableRecoreds } from '@/api/sys/dynamic/tableRecored';
import { nextTick, computed, onMounted, ref, unref, onUnmounted } from 'vue';
const list = ref<any[]>([])
const indexRef = ref(-1)
const text = computed(() => {
    return unref(list)[unref(indexRef)]?.text || ''
})
let interval
GetDynamicTableRecoreds({
    tableName: '文本收录表',
}).then((res) => {
    list.value = res
    if (res.length > 0) {
        indexRef.value = Math.floor(Math.random() * res.length)
        interval = setInterval(() => {
            indexRef.value = -1
            nextTick(() => {
                indexRef.value = Math.floor(Math.random() * res.length)
            })
        }, 10 * 1000)
    }

})
onUnmounted(() => {
    clearInterval(interval)
})
</script>