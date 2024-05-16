<template>
    <div v-loading="loadingRef">
        <FormComponent></FormComponent>
        <!-- <BasicButton type="primary" style="width: 100%;" :func="() => formMethods.submitFunction()">提交</BasicButton> -->
    </div>

</template>
<script lang="tsx" setup>
import { SaveTableRecord, GetTableRecord } from '@/api/sys/form';
import { EmptyUUId } from '@/utils/uuid';
import { useForm, type FormBind } from 'ttz-ui'
import { ref } from 'vue';
import { pick } from 'lodash';
import { watch } from 'vue';
import { message } from '@/utils/message';
const props = defineProps<{
    id?: UUID,
    tableId: UUID
    formProps?: FormBind
}>()
const emit = defineEmits<{
    submit: []
}>()
const loadingRef = ref(false)
watch(() => props.id, async (a, b) => {
    loadingRef.value = true
    if (props.id) {
        await GetTableRecord(props.id).then((res) => {
            formMethods.setModelValue(res)
        })
    }
    loadingRef.value = false
}, {
    immediate: true
})
const [FormComponent, formMethods] = useForm({
    ...props.formProps,
    submitApi: async (params) => {
        await SaveTableRecord(props.tableId, {
            ...params,
            Id: props.id || EmptyUUId
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