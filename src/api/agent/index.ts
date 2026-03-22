import { baseHttp } from "@/utils/http";

export async function testAgent(params) {
  return baseHttp.get(
    {
      url: "/openAI/test",
    },
    params,
  );
}
