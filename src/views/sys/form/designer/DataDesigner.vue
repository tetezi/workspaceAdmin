<template>
    <Form></Form>
</template>
<script lang="tsx" setup>
import { useForm } from 'ttz-ui'
const [Form,] = useForm({
    formSchemas: [
        { field: 'TableName',label:'TableName' , component: 'Input'},
        { field: 'Name',label:'Name' , component: 'Input'},
        { field: 'No',label:'No' , component: 'Input'},
        { field: 'Cols',label:'Cols' , component: 'Input'}, 
    ]
})
</script>