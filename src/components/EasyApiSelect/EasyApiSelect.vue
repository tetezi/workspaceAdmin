<template>
    <div>
        <ApiSelect v-bind="bind"></ApiSelect>

    </div>
</template>
<script lang="ts" setup generic="Params extends (Recordable), Option extends (Recordable)">

import { ApiSelect, defaultApiSelectProps, type ApiSelectProps, type SelectProps } from 'ttz-ui'
import { computed, type MaybeRefOrGetter } from 'vue';
import { easyApiMap, type EasyApiKey } from '@/utils/http/easyApiMap';
import { message } from '@/utils/message';
import { GetSIData } from '@/api/sys/interface';
type Props = {
    configLabel: EasyApiKey
}
const props = defineProps<Props>()

const bind = computed(() => {
    return {
        ...props,
        api: async (params) => {
            if (easyApiMap.has(props.configLabel)) {
                return await GetSIData(easyApiMap.get(props.configLabel) as string, params, {
                    pageIndex: 1, pageSize: 10
                })
            } else {
                message({
                    message: 'easyApi下拉框配置异常，请联系管理员',
                    configLabel: props.configLabel,
                    easyApiMap
                })
                return Promise.reject()
            }
        },
    }
})
</script>