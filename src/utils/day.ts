import dayjs from "dayjs";
export { dayjs }
export function formatToDate(date?: dayjs.ConfigType):StringOfDate{
  return dayjs(date).format("YYYY-MM-DD");
}
export function formatToDateTime(date?: dayjs.ConfigType):StringOfDateTime{
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}
