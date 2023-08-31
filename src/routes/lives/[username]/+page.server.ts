import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { APIResponse } from "$types";


export const load = ( async ({ cookies }) => {
  const data = cookies.get("livedata");
  if(data === null || data === undefined) {
    throw redirect(307, "/");
  }

  const { live, owner }: APIResponse = JSON.parse(data);
  return { live, owner }
}) satisfies PageServerLoad;
