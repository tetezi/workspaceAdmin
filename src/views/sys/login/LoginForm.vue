<template>
    <div>LoginForm

        <FormComponent></FormComponent>
        <BasicButton :func="() => formMethods.submitFunction()" type="primary">登录</BasicButton>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user';
import { BasicButton, useForm } from 'ttz-ui';
import { ref } from 'vue';
const userStore = useUserStore()
const [FormComponent, formMethods] = useForm({
    formSchemas: [
        { field: 'userNo', label: '账号', component: 'Input' },
        {
            field: 'password', label: '密码', component: 'Input', componentProps: {
                type: 'password'
            }
        },
    ],
    submitApi: userStore.login,
    onSubmit: (params, resutl) => {
        console.log(11, params, resutl)
    }
}) 
</script>