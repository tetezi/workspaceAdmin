<template>
    <ElMenu v-bind="bind" class="el-menu-vertical-demo">
        <component :is="() => getMenu(menuStore.menuList)"></component>
    </ElMenu>

</template>
<script lang="tsx" setup>
import { useMenuStore, type Menu } from '@/stores/modules/menu';
import { useSettingStore } from '@/stores/modules/setting';
import { computed, unref } from 'vue';
import { useRoute, } from 'vue-router';
import { BasicIcon } from 'ttz-ui'
import { ElMenuItem, ElSubMenu } from 'element-plus';
function calculateComplementaryColor(color) {
    let hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // 计算类白色
    let lightR = Math.min(255, r + 50);
    let lightG = Math.min(255, g + 50);
    let lightB = Math.min(255, b + 50);

    // 转换为十六进制表示
    let lightHex = '#' +
        ('0' + lightR.toString(16)).slice(-2) +
        ('0' + lightG.toString(16)).slice(-2) +
        ('0' + lightB.toString(16)).slice(-2);

    return lightHex;
}

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
                backgroundColor: isActive ? calculateComplementaryColor(settingStore.menu.bgColor) : settingStore.menu.bgColor
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