// import { EnumList } from "@/emums";
import {
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isString,
} from "lodash";
export function isUnDef(val: any): val is undefined {
  return typeof val === "undefined";
}
// export function isEnumList(e: any): e is EnumList<any, any,any, any> {
//   return e?.constructor === EnumList;
// }
export function isUUID(str: string): str is UUID {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}
export type DateType =
  | "undefined"
  | "boolean"
  | "string"
  | "number"
  | "method"
  | "array"
  | "null"
  | "object";
export function getDateType(value: any): DateType | "unknown" {
  if (isUnDef(value)) {
    return "undefined";
  } else if (isBoolean(value)) {
    return "boolean";
  } else if (isString(value)) {
    return "string";
  } else if (isNumber(value)) {
    return "number";
  } else if (isFunction(value)) {
    return "method";
  } else if (isArray(value)) {
    return "array";
  } else if (isObject(value)) {
    return "object";
  } else if (isNull(value)) {
    return "null";
  } else {
    return "unknown";
  }
}
