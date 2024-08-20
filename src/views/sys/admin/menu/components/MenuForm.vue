<template>
    <div v-loading="loadingRef">
        <FormComponent></FormComponent>
    </div>

</template>
<script lang="tsx" setup>
import { SaveTableRecord, GetTableRecord } from '@/api/sys/form';
import { useForm, EmptyUUId } from 'ttz-ui'
import { pick } from 'lodash';
import { ref } from 'vue';
import { watch } from 'vue';
import { GetMenu, SaveMenu } from '@/api/sys/menus';
const props = defineProps<{
    id?: UUID,
    parentId?: UUID
}>()
const emit = defineEmits<{
    submit: []
}>()
const loadingRef = ref(false)

const [FormComponent, formMethods] = useForm({
    defaultValue: { type: 'View', isEnabled: true },
    formSchemas: [
        { field: 'name', label: '名称', component: 'Input' },
        {
            field: 'type', label: '类型', component: 'Select', componentProps: {
                options: [
                    { value: 'Iframe', label: 'Iframe(开发中)' },
                    { value: 'View', label: '视图页面' },
                    { value: 'Group', label: '分组文件夹' },
                ]
            }
        },
        {
            field: 'routerPath', label: '路由Path', component: 'Input', ifShow: ({ formValue }) => {
                return formValue.type !== 'Group'
            }
        },
        {
            field: 'url', label: '文件路径', component: 'Input', ifShow: ({ formValue }) => {
                return formValue.type !== 'Group'
            }
        },
        { field: 'sort', label: '排序', component: 'InputNumber' },
        // { field: 'patentMenuId', label: 'patentMenuId', component: 'Input' },

        { field: 'isEnabled', label: '启用状态', component: 'Switch' },
        { field: 'param', label: '参数', component: 'Input' },
        { field: 'description', label: '备注', component: 'Input' },

    ],
    beforeSubmit: (raw) => {
        return {
            ...pick(raw, ['name', 'url', 'sort', 'routerPath', 'type', 'param', 'description', 'isEnabled']),
        }
    },
    submitApi: async (params) => {
        await SaveMenu({ id: props.id, parentMenuId: props.parentId, ...params })
    },
    onSubmit: () => {
        emit('submit')
    }
}, () => {
    watch([() => props.id, () => props.parentId], async () => {
        loadingRef.value = true
        if (props.id) {
            await GetMenu(props.id).then((res) => {
                formMethods.setModelValue(pick(res, ['name', 'url', 'sort', 'routerPath', 'type', 'param', 'description', 'isEnabled']))
            })
        }
        loadingRef.value = false
    }, {
        immediate: true
    })
})
defineExpose({
    submit: () => formMethods.submitFunction()
})
</script>