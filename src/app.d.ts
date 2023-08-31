// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

interface LiveData {
  id: string
  created_at: string
  finished_at: any
  user: User
  owner: Owner
  performers: any[]
  name: string
  description: string
  description_fragments: DescriptionFragment[]
  is_single: boolean
  is_adult: boolean
  is_r18: boolean
  is_r15: boolean
  is_broadcasting: boolean
  publicity: string
  is_closed: boolean
  mode: string
  server: string
  channel_id: string
  source: string
  is_enabled_mic_input: boolean
  is_enabled_gifting: boolean
  is_enabled_chat: boolean
  thumbnail: Thumbnail2
  member_count: number
  audience_count: number
  total_audience_count: number
  heart_count: number
  chat_count: number
  performer_count: number
}

interface OwnerData {
  id: number
  pixiv_user_id: number
  unique_name: string
  name: string
  description: string
  description_fragments: any[]
  icon: Icon
  following: boolean
  followed: boolean
  blocking: boolean
  _links: Links
  social_accounts: SocialAccounts
  stats: Stats
}

interface APIResponse {
  live: {
    id: string,
    name: string,
    hlsUrl: string,
    nsfw: boolean,
    isLive: boolean,
    thumbnail: string,
    heartCount: number,
    chatCount: number,
    audienceCount: number,
    totalAudienceCount: number
  },
  owner: {
    id: number,
    name: string,
    username: string,
    picture: string,
    following: number,
    followers: number
  }
}

interface User {
  id: number
  pixiv_user_id: number
  unique_name: string
  name: string
  icon: Icon
  following: boolean
  followed: boolean
  blocking: boolean
  _links: Links
}

interface Icon {
  id: number
  type: string
  color: Color
  photo: Photo
}

interface Color {
  hex: string
  r: number
  g: number
  b: number
}

interface Photo {
  original: ImageLink
  sq180: ImageLink
  pxsq180: ImageLink
  w540: ImageLink
  pxw540: ImageLink
  sq60: ImageLink
  pxsq60: ImageLink
  sq120: ImageLink
  pxsq120: ImageLink
  w240: ImageLink
  pxw240: ImageLink
}

interface ImageLink {
  width?: number
  height?: number
  url: string
  url2x?: string
}

interface Links {
  self: {
    method: string,
    href: string
  }
}

interface Owner {
  user: User
  thumbnail: Thumbnail
  connection_id: string
  client_id: string
  hls_movie: {
    url: string
  }
  is_enabled_mic_input: boolean
}

interface Thumbnail {
  sq800: ImageLink
  w160: ImageLink
  w400: ImageLink
  w1280: ImageLink
  original: ImageLink
}

interface DescriptionFragment {
  type: string
  body: string
  normalized_body: string
}

interface SocialAccounts {
  twitter: SocialLink
  pawoo: SocialLink
  pixiv: SocialLink
}

interface SocialLink {
  unique_name: string
  expired: boolean
  is_public: boolean
}

interface Stats {
  follower_count: number
  following_count: number
  heart_count: number
  resnap_count: number
  public_post_count: number
}


export { LiveData, OwnerData, APIResponse };
