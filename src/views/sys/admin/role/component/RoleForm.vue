<template>
    <div v-loading="loadingRef">
        <FormComponent></FormComponent>
        <!-- <BasicButton type="primary" style="width: 100%;" :func="() => formMethods.submitFunction()">提交</BasicButton> -->
    </div>

</template>
<script lang="ts" setup>
import { pick } from 'lodash';
import { useForm, type FormBind } from 'ttz-ui';
import { markRaw, ref, unref, watch } from 'vue';
import { GetRole, SaveRole } from '@/api/sys/role';

const props = defineProps<{
    id?: UUID,
}>()
const emit = defineEmits<{
    submit: []
}>()
const loadingRef = ref(false)
watch(() => props.id, async () => {
    loadingRef.value = true
    if (props.id) {
        await GetRole(props.id).then((res) => {
            formMethods.setModelValue(res)
        })
    }
    loadingRef.value = false
}, {
    immediate: true
})
const [FormComponent, formMethods] = useForm({
    defaultValue: { Cols: [] },
    formSchemas: ([
        { field: 'name', label: '名称', component: 'Input' },
        { field: 'description', label: '备注', component: 'Input' },
    ]),
    beforeSubmit: (raw) => {
        return {
            ...pick(raw, ['name', 'description']),
        }
    },
    submitApi: async (params) => {
        await SaveRole({
            ...params,
            id: props.id
        })
    },
    onSubmit: () => {
        emit('submit')
    }
})
defineExpose({
    submit: () => formMethods.submitFunction()
})
</script>