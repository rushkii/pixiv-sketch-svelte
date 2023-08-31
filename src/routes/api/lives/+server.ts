import { json, type RequestHandler } from "@sveltejs/kit";
import type { LiveData, OwnerData } from "$types";
import { dev } from "$app/environment";


type NonEmpty = LiveData | OwnerData;
type Empty = Record<string, never>;
type All = Empty | NonEmpty;


const cleanImageURL = (url: string) => {
  return `https://img-sketch.pximg.net/uploads${url.split("/uploads")[1]}`
}

const isObjectEmpty = (data: All): data is Empty => {
  return Object.keys(data).length === 0;
}


const getLiveData = async (liveId: string): Promise<LiveData | Empty> => {
  const res = await fetch(`https://sketch.pixiv.net/api/lives/${liveId}.json`);
  const { data } = await res.json();

  if(!isObjectEmpty(data)) {
    return data
  }

  return {};
}

const getLiveOwner = async (ownerId: string): Promise<OwnerData | Empty> => {
  const res = await fetch(`https://sketch.pixiv.net/api/users/${ownerId}`);
  const { data } = await res.json();

  if(!isObjectEmpty(data)) {
    return data
  }

  return {};
}


export const POST = ( async({ cookies, request}) => {
  const body = await request.formData();

  const liveData = await getLiveData(body.get("liveId") as string);
  if(isObjectEmpty(liveData)) {
    return json({status: 404, message: "Invalid liveId, might be wrong or not exist or LIVE has ended!"}, {statusText: "404"})
  }

  const liveOwner = await getLiveOwner(liveData.owner.user.id.toString());
  if(isObjectEmpty(liveOwner)) {
    return json({status: 404, message: "Invalid onwerId, might be wrong or not exist!"}, {statusText: "404"})
  }

  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000);
  const data = {
    live: {
      id: liveData.id,
      name: liveData.name,
      hlsUrl: liveData.owner.hls_movie.url,
      nsfw: liveData.is_adult || liveData.is_r18,
      isLive: liveData.is_broadcasting,
      thumbnail: cleanImageURL(liveData.thumbnail.original.url),
      heartCount: liveData.heart_count,
      chatCount: liveData.chat_count,
      audienceCount: liveData.audience_count,
      totalAudienceCount: liveData.total_audience_count
    },
    owner: {
      id: liveOwner.id,
      name: liveOwner.name,
      username: liveOwner.unique_name,
      picture: liveOwner.icon.photo.original.url,
      following: liveOwner.stats.following_count,
      followers: liveOwner.stats.follower_count
    }
  }

  cookies.set(
    "livedata",
    JSON.stringify(data),
    {
      sameSite: !dev ? "strict" : "lax",
      httpOnly: true,
      secure: !dev,
      expires: expires,
      path: "/"
    }
  )

  return json({status: 200, message: "success", data: data}, {statusText: "200"});
}) satisfies RequestHandler;
