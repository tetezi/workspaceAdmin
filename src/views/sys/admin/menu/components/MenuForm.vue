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
const props = defineProps<{
    id?: UUID,
    parentId?: UUID
    appId: UUID
}>()
const emit = defineEmits<{
    submit: []
}>()
const tableId = `b3969c99-07ed-4f5a-ac2e-bcb2566f5465`
const loadingRef = ref(false)

const [FormComponent, formMethods] = useForm({
    defaultValue: { Type: 'View' },
    formSchemas: [
        {
            field: 'No', label: '编号', component: 'Input', ifShow: Boolean(props.id), componentProps: {
                disabled: true
            }
        },
        { field: 'Name', label: '名称', component: 'Input' },
        {
            field: 'Type', label: 'Type', component: 'Select', componentProps: {
                options: [
                    { value: 'Iframe', label: 'Iframe(开发中)' },
                    { value: 'View', label: '视图页面' },
                    { value: 'Group', label: '分组文件夹' },
                ]
            }
        },
        {
            field: 'UrlLabel', label: '路由Path', component: 'Input', ifShow: ({ formValue }) => {
                return formValue.Type !== 'Group'
            }
        },
        {
            field: 'Url', label: '文件路径', component: 'Input', ifShow: ({ formValue }) => {
                return formValue.Type !== 'Group'
            }
        },
        { field: 'Sort', label: 'Sort', component: 'InputNumber' },
        // { field: 'ParentId', label: 'ParentId', component: 'Input' },

        // { field: 'AppId', label: 'AppId', component: 'Input' },
        { field: 'Param', label: 'Param', component: 'Input' },

    ],
    beforeSubmit: (raw) => {
        return {
            ...pick(raw, ['Name', 'Url', 'Sort', 'ParentId', 'UrlLabel', 'Type', 'Param', 'AppId']),
        }
    },
    submitApi: async (params) => {
        await SaveTableRecord(tableId, {
            ...params,
            AppId: props.appId,
            Id: props.id || EmptyUUId
        })
    },
    onSubmit: () => {
        emit('submit')
    }
}, () => {
    watch([() => props.id, () => props.parentId], async () => {
        loadingRef.value = true
        if (props.id) {
            await GetTableRecord(props.id).then((res) => {
                formMethods.setModelValue(res)
            })
        } else if (props.parentId) {
            formMethods.setFieldsValue('ParentId', props.parentId)
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