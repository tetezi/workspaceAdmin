<template>
    <div>
        <FormComp v-model='modelValue'></FormComp>
    </div>

</template>
<script lang="ts" setup>
import { useLocalProps, useLocalModel, useForm } from 'ttz-ui';
import type { DynamicFormSchema, FormRenderProps, FormRenderShortEvent, JavaScriptCode } from './types';
import { computed, unref } from 'vue';
import { isUnDef } from '@/utils/is';
import { message } from '@/utils/message';
import { get } from 'lodash';
const defaultProps = {
}
const props = defineProps<FormRenderProps>()

const emit = defineEmits<FormRenderShortEvent>()
const modelValue = defineModel<Recordable>()
const { getProps, setProps, emitEvent } = useLocalProps<FormRenderProps, FormRenderShortEvent, typeof defaultProps>(props, emit)
const { setFieldsValue, getFieldsValue, getModelValue, setModelValue } = useLocalModel(modelValue, () => ({}));
type WithoutUndefined<T> = T extends undefined ? never : T;
type ExecuteJSCode<T> = T extends JavaScriptCode<(infer R)> ? WithoutUndefined<R> : never
type GetJavaScriptCodeKey = WithoutUndefined<{
    [K in keyof DynamicFormSchema]: DynamicFormSchema[K] extends (JavaScriptCode<any> | undefined) ? K : never;
}[keyof DynamicFormSchema]>;
function executeJSCode<K extends GetJavaScriptCodeKey>(schema: DynamicFormSchema, key: K, defaultValue: ExecuteJSCode<DynamicFormSchema[K]>, argObject: Recordable = {}): ExecuteJSCode<DynamicFormSchema[K]> {
    const config = get(schema, key) as JavaScriptCode<any> | undefined
    if (config) {
        if (config.value) {
            return config.value
        } else if (config.code) {
            const JSCode = config.code
            if (isUnDef(JSCode)) {
                return defaultValue
            } else {
                const func = new Function(...Object.keys(argObject), JSCode)
                let result = defaultValue
                try {
                    result = func.call({}, ...Object.values(argObject))
                } catch (error) {
                    console.error(`JSCode运行异常:${(error as ReferenceError).message}`, {
                        rawError: error,
                    })
                }
                return result
            }
        }
    }
    return defaultValue

}
const [FormComp, formMethods] = useForm(() => ({
    formSchemas: unref(getProps).formSchemas.map((schema) => {
        return {
            schemaKey: schema.id,
            ifShow: (renderParams) => {
                return executeJSCode(schema, 'ifShow', true, { renderParams })
            },
            label: (renderParams) => {
                return executeJSCode(schema, 'label', '', { renderParams })
            },
            field: schema.field,
            category: schema.category,
            component: schema.component,
            componentProps: (renderParams) => {
                return executeJSCode(schema, 'componentProps', {}, { renderParams })
            },
            componentStyle: (renderParams) => {
                return executeJSCode(schema, 'componentStyle', {}, { renderParams })
            },
        } as any
    })
}))
</script>