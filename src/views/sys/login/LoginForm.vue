<template>
    <div style="width: 400px;padding:36px 24px ;border-radius: 5px;background-color: #FFFFFF;">
        <el-image :src="logo2" style="height: 80%;width:80%;margin:0px auto 8px;display: block;"></el-image>
        <div style="text-align: center;font-size: 1.5rem;line-height: 2rem;font-weight: 700;margin-bottom:12px;">
            登录</div>
        <FormComponent></FormComponent>
        <BasicButton :func="() => formMethods.submitFunction()" type="primary" style="width: 100%;" size="large">登录
        </BasicButton>
    </div>
</template>
<script lang="ts" setup>
import { PAGE } from '@/router/constant';
import { useUserStore } from '@/stores/modules/user';
import { message } from '@/utils/message';
import { BasicButton, useForm } from 'ttz-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logo2 from '@/assets/images/logo2.png'
const router = useRouter()
const userStore = useUserStore()
const [FormComponent, formMethods] = useForm({
    labelWidth: 0,
    formSchemas: [
        {
            field: 'userNo', label: '账号', component: 'Input',
            labelShow: false,
            componentProps: {
                size: 'large',
                placeholder: '请输入账号',
                onKeyupEnter: () => formMethods.submitFunction()
            }
        },
        {
            field: 'password', label: '密码', component: 'Input',
            labelShow: false,
            componentProps: {
                size: 'large',
                placeholder: '请输入密码',
                type: 'password',
                onKeyupEnter: () => formMethods.submitFunction()
            }
        },
    ],
    submitApi: userStore.login,
    beforeSubmit: (params) => {
        if (params.password && params.userNo) {
            return params
        } else {
            message('请先输入账号密码', 'warning')
            return Promise.reject()
        }
    },
    onSubmit: () => {
        router.replace(PAGE.home)
    }
}) 
</script>