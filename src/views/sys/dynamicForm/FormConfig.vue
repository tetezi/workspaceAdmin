<template>
    <div style="height:100%;display: flex;flex-direction: column;">
        <FormComp>
            <template #designer>
                <FormDesigner style="height:500px"></FormDesigner>

            </template>
        </FormComp>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import FormDesigner from './FormDesigner.vue'
import { useForm } from 'ttz-ui';
const formSchemas = ref([])
const [FormComp] = useForm({
    labelPosition: 'top',
    formSchemas: [
        { field: 'title', label: '名称', component: 'Input' },
        {
            field: 'title', label: '备注', component: 'Input', componentProps: {
                type: 'textarea'
            }
        },
        {
            field: 'title', label: '设计器', component: 'Input', slot: 'designer',
        },
    ]
})
</script>