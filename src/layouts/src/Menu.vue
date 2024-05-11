<template>
    <ElMenu v-bind="bind" class="el-menu-vertical-demo">
        <component :is="()=>getMenu(menuStore.menuList)"></component>
    </ElMenu>

</template>
<script lang="tsx" setup>
import { useMenuStore, type Menu } from '@/stores/modules/menu';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BasicIcon from '@/components/Icon/BasicIcon.vue'
import { ElMenuItem, ElSubMenu } from 'element-plus';

const backgroundColor = '#292D3E'
const activeBackgroundColor = '#0960BD'
const textColor = '#E5E7EB'
const route = useRoute()
const menuStore = useMenuStore()
const bind = computed(() => ({
    style: {
        borderRight: `1px solid ${backgroundColor}`,
    },
    router: true,
    defaultActive: route.fullPath,
    collapse: false,
    activeTextColor: textColor,
    textColor: textColor,
    backgroundColor: backgroundColor
}))
function getMenu(routes: Array<Menu>) {
    return routes.map((item) => {
        const { SubMenus, UrlLabel, Name, Id } = item
        const isActive = route.path === UrlLabel
        if (SubMenus && SubMenus.length > 0) {
            return <ElSubMenu index={Id} >
                {{
                    title: () => [<BasicIcon icon='Location' />, <span>{Name}</span>],
                    default: () => getMenu(SubMenus)
                }}
            </ElSubMenu>
        } else {
            return <ElMenuItem index={Id} route={String(UrlLabel)} style={{
                backgroundColor: isActive ? activeBackgroundColor : backgroundColor
            }}>
                <BasicIcon icon='Location' />
                <span>{Name} </span>
            </ElMenuItem>
        }

    })
} 
</script>
<style>
:root {
    /* --el-menu-bg-color: #292D3E; */
    /* 设置 Menu 组件的背景颜色 */
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>