<template>
    <ElMenu v-bind="bind">
        <component :is="()=>getMenu(menuStore.menuList)"></component>
    </ElMenu>

</template>
<script lang="tsx" setup>
import { useMenuStore, type Menu } from '@/stores/modules/menu';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BasicIcon from '@/components/Icon/BasicIcon.vue'
import { ElMenuItem, ElSubMenu } from 'element-plus';


const route = useRoute()
const menuStore = useMenuStore()
const bind = computed(() => ({
    style: {
        borderRight: '1px solid #292D3E'
    },
    router: true, defaultActive: route.fullPath, collapse: false, activeTextColor: "#E5E7EB", textColor: '#E5E7EB', backgroundColor: '#292D3E'
}))
function getMenu(routes: Array<Menu>) {
    return routes.map((item) => {
        const { SubMenus, UrlLabel, Name, Id } = item
        const isActive = route.path === UrlLabel
        if (SubMenus && SubMenus.length > 0) {
            return <ElSubMenu index={Id} >
                {{
                    title: () => <div  ><BasicIcon icon='location' /> <span>{Name}</span></div>,
                    default: () => getMenu(SubMenus)
                }}
            </ElSubMenu>
        } else {
            return <ElMenuItem index={Id} route={String(UrlLabel)} style={{
                backgroundColor: isActive ? '#0960BD' : ''
            }}>
                <BasicIcon icon='location' />
                <span>{Name} </span>
            </ElMenuItem>
        }

    })
} 
</script>