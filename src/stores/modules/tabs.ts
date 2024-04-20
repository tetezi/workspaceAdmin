import { getStorageName } from "@/utils/env";
import { isUndefined } from "lodash";
import { defineStore } from "pinia";
export type Tab = {
  path: string;
  title: string;
  include: boolean;
};
type TabState = {
  tabs: Array<Tab>;
};
export const useTabStore = defineStore({
  id: "tab", // 命名，唯一
  state: (): TabState => {
    return {
      tabs: [],
    };
  },
  persist: [
    {
      key: `${getStorageName()}_tab`,
      storage: localStorage,
    },
  ],
  getters: {
    getTabPaths(): Array<string> {
      return this.tabs.map((i) => i.path);
    },
  },
  actions: {
    getTabIndexByPath(path: string): number {
      return this.tabs.findIndex((i) => i.path === path);
    },
    getTabByIndex(index: number): Tab {
      return this.tabs[index];
    },
    getTabByPath(path: string): Tab | undefined {
      return this.tabs.find((i) => i.path === path);
    },
    setTabs(tabs: Array<Tab>) {
      this.tabs = tabs;
    },
    addTab(tab: Tab, index?: number) {
      if (this.getTabByPath(tab.path)) {
        return;
      }
      if (isUndefined(index)) {
        index = this.tabs.length;
      }
      this.tabs.splice(index, 0, tab);
    },
    delTabByPath(path: string) {
      this.setTabs(this.tabs.filter((i) => i.path !== path));
    },
  },
});
