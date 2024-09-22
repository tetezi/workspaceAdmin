import { GetEnumCategory, type EnumDetailType } from "@/api/sys/enum";
import { isArray, isString } from "lodash";
import { computed, ref, unref } from "vue";

export async function useEnum(nameOrDetails: string | EnumDetailType[]) {
  const enumDetailsRef = ref<EnumDetailType[]>([]);
  if (isString(nameOrDetails)) {
    enumDetailsRef.value = (await GetEnumCategory(nameOrDetails)).details;
  } else if (isArray(nameOrDetails)) {
    enumDetailsRef.value = nameOrDetails;
  }
  function getName(val: string) {
    return unref(enumDetailsRef).find((item) => item.value === val)?.name;
  }
  return {
    getEnumDetails: computed(() => unref(enumDetailsRef)),
    getName,
  };
}
