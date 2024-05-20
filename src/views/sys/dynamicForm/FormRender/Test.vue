<template>
    {{ val }}
    <FormRender v-model="val" v-bind="props"></FormRender>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import FormRender from './FormRender.vue';
const val = ref({})
const props = {
    name: '测试表单',
    hooks: {},
    submitApi: { linkDataRecordNo: '141' },
    formSchemas: [{
        id: 'asdasda',
        category: "Input",
        component: 'Input',
        label: 'label',
        field: 'field'
    }] as any
}
</script>