<template>

    <el-container>
        <el-aside width="200px" style="border: 1px solid #eee;">
            <div>
                <BasicButton :func="editSchema">编辑</BasicButton>
                <BasicButton :func="delSchema">删除</BasicButton>
            </div>
            <el-tree :data="modelValue" :props="treeProps" draggable :allow-drop="allowDrop" ref="SchemasTreeRef"
                :expand-on-click-node="false" nodeKey="schemaKey" highlight-current>
            </el-tree>
            <SchemaEditorComp :renderParams="props.renderParams" ref="SchemaEditorRef" @submit="onSubmitSchemaEditor">
            </SchemaEditorComp>
        </el-aside>
        <el-container>
            <el-header style="border: 1px solid #eee;display: flex;flex-direction: row;align-items: center; ">
                <!-- <BasicButton :type="'primary'" style="margin:5px">
                    输入类型
                </BasicButton>
                <BasicButton :type="'success'" style="margin:5px">
                    容器类型
                </BasicButton>
                <BasicButton :type="'info'" style="margin:5px">
                    独立类型
                </BasicButton> -->
                <Checkbox style="min-width: none;" v-model="preinstallFilter.category" isButton :options="[
                    { label: '输入类型', value: 'Input' },
                    { label: '容器类型', value: 'Container' },
                    { label: '独立类型', value: 'Display' },
                ]"></Checkbox>
                <Input style='flex:1;width:100%' v-model="preinstallFilter.q" placeholder="输入组件名称筛选" clearable></Input>




            </el-header>
            <el-main style="border: 1px solid #eee;">
                <PreinstallFormSchemas :filter="preinstallFilter" @selectPreinstall="onSelectPreinstall">
                </PreinstallFormSchemas>
            </el-main>
        </el-container>
    </el-container>
</template>
<script lang="tsx" setup>
import type { DynamicFormSchemaType } from '@/components/DynamicFormDialog/types';
import type { ElTree } from 'element-plus';
import { BasicButton, Checkbox, Input } from 'ttz-ui'
import { ref, unref, } from 'vue';
import SchemaEditorComp from './SchemaEditor.vue'
import PreinstallFormSchemas from './PreinstallFormSchemas.vue'
const props = defineProps<{
    renderParams: any[]
}>()
const SchemasTreeRef = ref<InstanceType<typeof ElTree>>()
const SchemaEditorRef = ref<InstanceType<typeof SchemaEditorComp>>()
const modelValue = defineModel<DynamicFormSchemaType[]>()
const preinstallFilter = ref({
    category: ['Display', 'Container', 'Input'],
    q: ''
})
const treeProps = {
    children: 'children',
    label: function (data: DynamicFormSchemaType) {
        const { category, component, name = '', field = '', label = "" } = data

        if (category === 'Container') {
            return <span> {name || component} </span>
        } else if (category === 'Display') {
            return `${name || component}`
        } else if (category === 'Input') {
            return <span>{name || label}<span style='font-size:.9em;opacity:.9;margin-left:5px'>{field}</span></span>
        } else {
            return '未知节点'
        }
    },
} as any

function allowDrop(draggingNode, dropNode, type) {
    const { data: dropData } = dropNode
    if (type === 'inner') {
        if (dropData.category === 'Container') {
            return true
        } else {
            return false
        }
    } else {
        return true
    }
}
/**
 * 获取选中的表单子项 
 */
async function getSelectedSchema() {
    const selectedSchema = unref(SchemasTreeRef)?.getCurrentNode() as DynamicFormSchemaType
    if (selectedSchema) {
        return selectedSchema
    } else {
        return Promise.reject('未选择任何节点')
    }
}
/**
 *  编辑表单子项
 */
async function editSchema() {
    const selectedSchema = await getSelectedSchema()
    await unref(SchemaEditorRef)?.open((selectedSchema), { type: 'edit', currentKey: unref(SchemasTreeRef)?.getCurrentKey() })

}
/**
 *  删除表单子项
 */
async function delSchema() {
    const selectedSchema = await getSelectedSchema()
    unref(SchemasTreeRef)?.remove(selectedSchema)
}
/**
 * 表单子项编辑器提交回调
 */
function onSubmitSchemaEditor(schema: DynamicFormSchemaType, meta) {
    const { type, currentKey } = meta 
    if (type === 'edit') {
        const node = unref(SchemasTreeRef)?.getNode(currentKey)
        const children = node?.parent.data.children || node?.parent.data || []
        const index = children.findIndex((d) => d.schemaKey === currentKey)
        if (index !== -1) {
            children.splice(index, 1, schema)
        }
        // unref(SchemasTreeRef)?.update(currentKey, data)
    } else if (type === 'add') {
        if (currentKey) {
            const node = unref(SchemasTreeRef)?.getNode(currentKey)
            const currentNodeData = node?.data as DynamicFormSchemaType
            if (currentNodeData.category === 'Container') {
                unref(SchemasTreeRef)?.append(schema, currentNodeData)
            } else {
                unref(SchemasTreeRef)?.insertAfter(schema, currentNodeData)
            }
        } else {
            modelValue.value = [...(unref(modelValue) || []), schema]
        }
    }
}
function onSelectPreinstall(schema: DynamicFormSchemaType) {
    unref(SchemaEditorRef)?.open(schema, { type: 'add', currentKey: unref(SchemasTreeRef)?.getCurrentKey() })
}
</script>
