<template>
    <div>
        <div :style="{ textAlign: 'center', margin: '5px', }">预设组件</div>
        <Draggable :list='preinstallFormSchemas' item-key="id"
            :group="{ name: 'formSchemas', pull: 'clone', put: false }" :clone>
            <template #item="{ element }">
                <div :style="{
                    border: '1px solid black',
                    padding: '5px',
                    margin: '5px',
                    textAlign: 'center',
                }"> {{ element.component }}</div>
            </template>
        </Draggable>
    </div>

</template>
<script lang="ts" setup>

import type { DesignFormSchema } from 'ttz-ui';

import { cloneDeep } from 'lodash';
import { ref } from 'vue';
import Draggable from 'vuedraggable'
import { buildUUID } from 'ttz-ui';
const preinstallFormSchemas = ref<DesignFormSchema[]>([
    {
        component: 'Input', category: 'Input'
    },
    {
        component: 'BasicButton', category: 'Display',
        componentProps: {
            type: 'code',
            code: (
                `return  {
    label: '按钮',
    func: () => {
        console.log('点击了按钮')
    }
}`)
        },
    },
    {
        component: 'Card',
        category: 'Container',
        componentProps: {
            type: 'code',
            code:
                `return {
    title:'标题'
}`
        },
        children: [],
    },
])
function clone(raw) {
    const data = cloneDeep(raw)
    function getCloneConfig(config) {
        const id = buildUUID()
        const displayConfig = (config.category === 'Display') ? {
        } : undefined
        const containerConfig = (config.category === 'Container') ? {
        } : undefined
        const inputConfig = (config.category === 'Input') ? {
            field: config.component,
            label: {
                type: 'value',
                value: config.component
            },
            labelShow: {
                type: 'value',
                value: true
            },
            labelWidth: undefined,
            labelRender: undefined,
        } : undefined
        return {
            componentProps: undefined,
            componentStyle: undefined,
            componentSlot: undefined,
            ifShow: undefined,
            render: undefined,
            ...displayConfig,
            ...inputConfig,
            ...containerConfig,
            ...config,
            id,
            children: (config.category === 'Container') ? ((config.children || []).map(getCloneConfig)) : undefined
        }
    }
    return getCloneConfig(data)
}

</script>