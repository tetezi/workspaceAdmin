<template>
    <ElMenu v-bind="bind" class="el-menu-vertical-demo">
        <component :is="() => getMenu(menuStore.menuList)"></component>
    </ElMenu>

</template>
<script lang="tsx" setup>
import { useMenuStore, type Menu } from '@/stores/modules/menu';
import { useSettingStore } from '@/stores/modules/setting';
import { computed } from 'vue';
import { useRoute, } from 'vue-router';
import BasicIcon from '@/components/Icon/BasicIcon.vue'
import { ElMenuItem, ElSubMenu } from 'element-plus';

const activeBackgroundColor = '#0960BD'
const textColor = '#E5E7EB'
const route = useRoute()
const menuStore = useMenuStore()
const settingStore = useSettingStore()
const bind = computed(() => ({
    style: {
        borderRight: `1px solid ${settingStore.menu.bgColor}`,
    },
    router: true,
    defaultActive: route.fullPath,
    collapse: settingStore.menu.collapse,
    activeTextColor: textColor,
    textColor: textColor,
    backgroundColor: settingStore.menu.bgColor
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
                backgroundColor: isActive ? activeBackgroundColor : settingStore.menu.bgColor
            }}>
                <BasicIcon icon='Location' />
                <span>{Name} </span>
            </ElMenuItem>
        }

    })
} 
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
}
</style>