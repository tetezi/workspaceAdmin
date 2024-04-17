import { baseHttp } from "@/utils/http";
export async function Login(params: { userNo: string; password: string }) {
  return baseHttp.post(
    {
      url: "/Account/Login",
    },
    params
  );
}
