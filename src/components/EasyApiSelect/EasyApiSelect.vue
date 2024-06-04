<template>
    <ApiSelect v-bind="bind" v-model="modelValue"></ApiSelect>
</template>
<script lang="ts" setup generic="Params extends (Recordable), Option extends (Recordable)">

import { ApiSelect, type ApiSelectProps, type SelectProps } from 'ttz-ui'
import { get, } from 'lodash'
import { computed, unref } from 'vue';
import { easyApiMap, type EasyApiKey } from '@/utils/http/easyApiMap';
import { message } from '@/utils/message';
import { GetSIData } from '@/api/sys/interface';
import { isUndefined } from "lodash";
type Props = {
    configLabel: EasyApiKey
    initAutoSelectFirst?: boolean
    labelField: SelectProps<Option>['labelField']
    valueField: SelectProps<Option>['valueField']
    isObject?: SelectProps<Option>['isObject']
    immediate?: ApiSelectProps<Params, Option>['immediate']
}
const modelValue = defineModel<string | Option>()
const props = withDefaults(defineProps<Props>(), {
    initAutoSelectFirst: false,
    labelField: 'label',
    valueField: 'value',
    immediate: false
})
const bind = computed(() => {
    return {
        ...props,
        api: async (params) => {
            if (easyApiMap[props.configLabel]) {
                const { rows } = await GetSIData(easyApiMap[props.configLabel], params, {
                    pageIndex: 1, pageSize: 10
                })
                return rows
            } else {
                message({
                    message: 'easyApi下拉框配置异常，请联系管理员',
                    configLabel: props.configLabel,
                    easyApiMap
                })
                return Promise.reject()
            }
        },
        onInit: (data) => {
            if (props.initAutoSelectFirst && isUndefined(unref(modelValue)) && data.length > 0) {
                modelValue.value = props.isObject ? data[0] : get(data[0], props.valueField)
            }
        }
    }
})
</script>