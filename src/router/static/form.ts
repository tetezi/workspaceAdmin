export default {
  path: "/form",
  children: [
    {
      path: "designer",
      name: `designer`,
      children: [
        {
          path: "data",
          name: `dataDesigner`,
          component: () => import("@/views/sys/form/designer/DataDesigner.vue"),
        },
        {
          path: "sql",
          name: `sqlDesigner`,
          component: () => import("@/views/sys/form/designer/SqlDesigner.vue"),
        },
      ],
    },
    {
      path: "records",
      name: `records`,
      children: [
        {
          path: "data",
          name: `dataRecords`,
          component: () => import("@/views/sys/form/records/DataRecords.vue"),
        },
      ],
    },
  ],
};
