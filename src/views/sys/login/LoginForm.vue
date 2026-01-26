<!--
 * @Author: tetezi MaHouShouJoTetezi@foxmail.com
 * @Date: 2024-09-22 16:25:59
 * @LastEditors: tetezi MaHouShouJoTetezi@foxmail.com
 * @LastEditTime: 2025-11-21 00:29:35
 * @FilePath: \workspaceAdmin\src\views\sys\login\LoginForm.vue
 * @Description: 
-->
<template>
    <div style="width: 400px;padding:36px 24px ;border-radius: 5px;background-color: #FFFFFF;">
        <el-image :src="logo2" style="height: 80%;width:80%;margin:0px auto 8px;display: block;"></el-image>
        <div style="text-align: center;font-size: 1.5rem;line-height: 2rem;font-weight: 700;margin-bottom:12px;">
            登录</div>
        <FormComponent></FormComponent>
        <BasicButton :loading="loadingRef" :func="submit" type="primary" style="width: 100%;" size="large">登录
        </BasicButton>
    </div>
</template>
<script lang="ts" setup>
import { PAGE } from '@/router/constant';
import { useUserStore } from '@/stores/modules/user';
import { message } from '@/utils/message';
import { BasicButton, useForm } from 'ttz-ui';
import { useRouter } from 'vue-router';
import logo2 from '@/assets/images/logo2.png'
import { ref } from 'vue';
const router = useRouter()
const userStore = useUserStore()
const [FormComponent, formMethods] = useForm({
    labelWidth: 0,
    defaultValue:{
        userNo: 'admin',
        password: '123456'
    },
    formSchemas: [
        {
            field: 'userNo', label: '账号', component: 'Input',
            labelShow: false,
            componentProps: {
                size: 'large',
                placeholder: '请输入账号',
                onKeyupEnter: submit
            }
        },
        {
            field: 'password', label: '密码', component: 'Input',
            labelShow: false,
            componentProps: {
                size: 'large',
                placeholder: '请输入密码',
                type: 'password',
                onKeyupEnter: submit
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
const loadingRef = ref(false)
async function submit() {
    loadingRef.value = true
    return formMethods.submitFunction().finally(() => {
        loadingRef.value = false
    })
}
</script>