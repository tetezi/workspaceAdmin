<template>
    <DialogFormComp v-if="dynamicFormRef">
    </DialogFormComp>
</template>
<script lang="tsx" setup>
import { GetDynamicForm, } from '@/api/sys/dynamic/form';

import { useDialogForm } from 'ttz-ui';
import { isFunction, isPlainObject, isString } from 'lodash';
import { computed, markRaw, ref, unref, watchEffect } from 'vue';
import type { DynamicFormSchemaType, DynamicFormType } from './types';
import { dynamicUtils } from './dynamicUtils';
import { EnumSelect } from '../EnumSelect';

const props = defineProps<{
    title: string,
    dynamicFormId?: UUID,
    dynamicForm?: MakePartialAndRemove<DynamicFormType, "id">
    submitFunc: (data: Recordable) => Promise<any>,
    extraRenderParams: Recordable<any>
}>()
const dynamicFormRef = ref<MakePartialAndRemove<DynamicFormType, "id">>()

const injectParams = computed(() => ({
    ...props.extraRenderParams,
    ...dynamicUtils,
}))
watchEffect(async () => {
    if (props.dynamicFormId) {
        dynamicFormRef.value = await GetDynamicForm(props.dynamicFormId)
    } else if (props.dynamicForm) {
        dynamicFormRef.value = props.dynamicForm
    }
})
const formSchemasRef = computed(() => {
    if (unref(dynamicFormRef)) {
        return unref(dynamicFormRef)?.schemas || []
    } else {
        return []
    }
})
const actialConfigRef = computed(() => {
    function evalSchemaConfig(schema: DynamicFormSchemaType) {
        function evalSchemaAttributeConfig(configKey, defaultValue) {
            const config = schema[configKey]
            if (config) {
                if (isString(config) || config.type === 'code') {
                    const code = isString(config) ? config : config.code
                    if (code) {
                        return (formItemRenderParams) => {
                            let result = defaultValue
                            try {
                                const func = new Function('renderParams', code)
                                result = func.call({}, formItemRenderParams)
                            } catch (error) {
                                console.error(`JSCode运行异常:${(error as ReferenceError).message}`, {
                                    rawError: error, code, schema, configKey
                                })
                            }
                            return result
                        }
                    } else {
                        return defaultValue
                    }
                } else if (config.type === 'value') {
                    return config.value ?? defaultValue
                }
            } else {
                return defaultValue
            }
        }
        const reulust = {
            schemaKey: schema.schemaKey,
            ifShow: evalSchemaAttributeConfig('ifShow', true),
            label: schema.label,
            labelRender: evalSchemaAttributeConfig('labelRender', undefined),
            labelShow: evalSchemaAttributeConfig('labelShow', true),
            labelWidth: evalSchemaAttributeConfig('labelWidth', undefined),
            field: schema.field,
            category: schema.category,
            component: schema.component,
            children: (schema.children || []).map(evalSchemaConfig),
            componentProps: evalSchemaAttributeConfig('componentProps', {}),
            componentStyle: evalSchemaAttributeConfig('componentStyle', {}),
            componentRender: evalSchemaAttributeConfig('componentRender', {}),
            render: evalSchemaAttributeConfig('render', undefined),
            componentSlot: evalSchemaAttributeConfig('componentSlot', undefined),
            colProps: schema.colProps,
        }
        return reulust
    }
    function evalMainConfig<T>(configKey: string, defaultValue: T): T {
        const code = unref(dynamicFormRef)?.[configKey]
        if (code) {
            try {
                const func = new Function('renderParams', code)
                return func.call({}, {
                    ...unref(injectParams),
                    formMethods: unref(isOK) ? unref(dialogFormMethods.getFormMethods) : undefined
                })
            }
            catch (error) {
                console.error(`JSCode运行异常:${(error as ReferenceError).message}`, {
                    rawError: error, code, configKey
                })
                return defaultValue
            }
        } else {
            return defaultValue
        }
    }
    return {
        beforeSubmit: evalMainConfig('beforeSubmit', (p) => (p)),
        defaultValue: evalMainConfig('defaultValue', {}),
        formSchemas: unref(formSchemasRef).map(evalSchemaConfig),
        labelPosition: unref(dynamicFormRef)?.labelPosition
    }
})
const [DialogFormComp, dialogFormMethods, isOK] = useDialogForm<Recordable>(() => ({
    title: props.title,
    width: '90%',
    closeOnClickModal: false,
    formSchemas: unref(actialConfigRef).formSchemas,
    submitApi: props.submitFunc,
    labelPosition: unref(actialConfigRef).labelPosition,
    beforeSubmit: async (data) => {
        const { beforeSubmit } = unref(actialConfigRef)
        return await isFunction(beforeSubmit) ? beforeSubmit(data) : data
    },
    injectParams: unref(injectParams), injectComponents: [['EnumSelect', markRaw(EnumSelect)]]
}))
defineExpose({
    open: (data) => {
        if (data) {
            return dialogFormMethods.open(data)
        } else {
            const { defaultValue } = unref(actialConfigRef)
            return dialogFormMethods.open(isPlainObject(defaultValue) ? defaultValue : {})
        }
    },
    close: () => dialogFormMethods.close(),
})
</script>