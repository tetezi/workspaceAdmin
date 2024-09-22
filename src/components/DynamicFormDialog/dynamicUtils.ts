import { baseHttp } from "@/utils/http";
import {
  GetDynamicTableRecored,
  GetDynamicTableRecoreds,
} from "@/api/sys/dynamic/tableRecored";
import { readonly } from "vue";
import { GetEnumCategory } from "@/api/sys/enum";
const apiMethods = readonly({
  baseGet: baseHttp.get,
  basePost: baseHttp.post,
  getDynamicTableRecored: GetDynamicTableRecored,
  getDynamicTableRecoreds: GetDynamicTableRecoreds,
  getEnumCategory: GetEnumCategory,
});
export const dynamicUtils = {
  apiMethods,
};
