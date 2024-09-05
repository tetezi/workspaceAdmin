<template>
    <div style="height: 100%;box-sizing: border-box;padding:8px  ">
        <!-- <TableComp style="padding:8 16px">
        </TableComp>
        <DialogFormComp>
        </DialogFormComp> -->
        {{ query }}
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';

const { query } = useRoute()
</script>