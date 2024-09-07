<template>
    <DialogFormComp v-if="dynamicFormRef">
    </DialogFormComp>
</template>
<script lang="tsx" setup>
import { GetDynamicForm, type DynamicFormType } from '@/api/sys/dynamic/form';
import { useDialogForm } from 'ttz-ui';
import { computed, ref, unref, watchEffect } from 'vue';
const props = defineProps<{
    title: string,
    dynamicFormId?: UUID,
    submitFunc: (data: Recordable) => Promise<any>,
    viewCompMethods: Recordable<Function>
}>()
const dynamicFormRef = ref<Omit<DynamicFormType, 'schemas'> & { schemas: any[] }>()
const renderParams = computed(() => {
    return {
        viewCompMethods: props.viewCompMethods,
        formMethods: unref(isOK) ? unref(dialogFormMethods.getFormMethods) : undefined
    }
})
function evalStringCodeFunc<T>(code: string | undefined, defaultValue: T, extraRenderParams?: Recordable): T {
    if (code) {
        try {
            const func = new Function('renderParams', code)
            return func({
                ...unref(renderParams), ...extraRenderParams
            })
        }
        catch (e) {
            console.log('err', e)
            return defaultValue
        }
    } else {
        return defaultValue
    }
}

watchEffect(async () => {
    if (props.dynamicFormId) {
        dynamicFormRef.value = await GetDynamicForm(props.dynamicFormId).then((res) => {
            return {
                ...res, schemas: JSON.parse(res.schemas)
            }
        })
    }
})
const formSchemasRef = computed(() => {
    if (unref(dynamicFormRef)) {
        return unref(dynamicFormRef)?.schemas || []
    } else {
        return []
    }
})
const [DialogFormComp, dialogFormMethods, isOK] = useDialogForm<Recordable>(() => ({
    title: props.title,
    width: '90%',
    closeOnClickModal: false,
    formSchemas: unref(formSchemasRef),
    submitApi: props.submitFunc,
    beforeSubmit: async (data) => {
        if (unref(dynamicFormRef)?.beforeSubmit) {
            const beforeSubmit = evalStringCodeFunc(unref(dynamicFormRef)?.beforeSubmit, (p) => (p))
            return await beforeSubmit(data)
        } else {
            return data
        }
    },
    isDesignFormSchema: true
}))
defineExpose({
    open: (data) => dialogFormMethods.open(data),
    close: () => dialogFormMethods.close(),
})
</script>