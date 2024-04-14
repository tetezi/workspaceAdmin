export default {
  path: "/form",
  redirect: "404",
  children: [
    {
      path: "/form/designer/dataDesigner",
      name: `dataDesigner`,
      component: () => import("@/views/sys/form/designer/DataDesigner.vue"),
    },
  ],
};
