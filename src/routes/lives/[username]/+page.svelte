<script lang="ts">
	import type { PageServerData } from "./$types";
  import { onMount } from 'svelte';
  import Hls from 'hls.js';


  export let data: PageServerData
  const { live, owner } = data;
  let videoHls: HTMLVideoElement;
  let messages: any[];
  $: messages = [];
  $: audiences = {
    audienceCount: live.audienceCount,
    totalAudienceCount: live.totalAudienceCount
  }

  const addBubble = (name: string, message: string, picture: string) => {
    const bubbleContainer = document.createElement("div");
    bubbleContainer.className = "flex";

    const profileImage = document.createElement("img");
    profileImage.className = "rounded-full";
    profileImage.src = picture;
    profileImage.alt = "";
    profileImage.width = 35;
    profileImage.height = 35;

    const messageContainer = document.createElement("div");
    messageContainer.className = "flex ml-2 space-x-1 items-center";

    const nameElement = document.createElement("span");
    nameElement.className = "font-bold text-lg";
    nameElement.textContent = name;

    const messageElement = document.createElement("span");
    messageElement.textContent = message;

    messageContainer.appendChild(nameElement);
    messageContainer.appendChild(messageElement);

    bubbleContainer.appendChild(profileImage);
    bubbleContainer.appendChild(messageContainer);

    return bubbleContainer;
  }

  onMount(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(live.hlsUrl);
      hls.attachMedia(videoHls);
    } else if (videoHls.canPlayType('application/vnd.apple.mpegurl')) {
      videoHls.src = live.hlsUrl;
    }

    const ws = new WebSocket(`wss://sketch.pixiv.net/ws/lives?live_id=${live.id}`)
    ws.addEventListener("message", (message: any) => {
      const data = JSON.parse(message.data);
      console.log(data);

      const chatEl = document.getElementById("chat") as HTMLDivElement;

      if(data.type === "chat") {
        chatEl.appendChild(addBubble(data.chat.user.name, data.chat.message, data.chat.user.icon.photo.original.url))
      }else if(data.type === "heart") {
        chatEl.appendChild(addBubble(data.user.name, `❤️${data.count}`, data.user.icon.photo.original.url))
      } else if(data.type === "audience_count_updated") {
        audiences.audienceCount = data.count;
        audiences.totalAudienceCount = data.total;
      }
    });
  });
</script>


<div class="flex flex-col w-screen bg-[#f9f5ef]">
  <div class="flex flex-col items-center w-full bg-white">
    <div class="flex flex-col max-w-[580px] w-full">
      <div class="flex justify-center items-center h-[80px]">
        <a href="/">
          <svg class="w-[125px] h-[125px] text-[#2e97d8]"><use xlink:href="#sketch-text"><symbol id="sketch-text" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2.347 10.95c.007.347.356.587 1.048.719h.01c.398.073.706.184.924.334.266.174.4.404.4.69 0 .288-.134.529-.403.723a1.56 1.56 0 0 1-.941.292c-.457-.003-.903-.179-1.34-.526-.055-.05-.06-.103-.015-.162a.116.116 0 0 1 .078-.042.105.105 0 0 1 .083.026c.391.317.789.473 1.194.47.318 0 .584-.08.799-.24.207-.15.311-.33.311-.543 0-.39-.379-.655-1.136-.798h-.01c-.82-.153-1.23-.467-1.23-.944 0-.271.123-.497.37-.678.248-.18.543-.271.885-.271.149 0 .299.025.45.076.15.05.266.099.35.146.082.047.19.114.321.2.062.042.073.096.031.162-.038.063-.09.073-.155.031a8.361 8.361 0 0 0-.304-.187 1.723 1.723 0 0 0-.311-.133 1.196 1.196 0 0 0-.382-.066c-.29 0-.538.074-.742.22-.19.142-.285.309-.285.5zm3.31 2.628v-3.385a.13.13 0 0 1 .037-.091.116.116 0 0 1 .088-.04.129.129 0 0 1 .13.131v2.112L8.107 10.1a.138.138 0 0 1 .093-.036.12.12 0 0 1 .088.036.121.121 0 0 1 .037.089.13.13 0 0 1-.042.094l-1.39 1.397 1.421 1.815c.045.063.038.124-.02.183a.134.134 0 0 1-.089.026.1.1 0 0 1-.088-.047l-1.406-1.794-.8.803v.913a.117.117 0 0 1-.038.089.129.129 0 0 1-.18 0 .121.121 0 0 1-.035-.09zm3.71 0v-3.4c0-.035.013-.065.037-.09a.12.12 0 0 1 .088-.036h1.869a.124.124 0 0 1 .125.128.124.124 0 0 1-.125.128H9.622v1.444h1.52c.035 0 .065.014.089.04a.13.13 0 0 1 0 .18.12.12 0 0 1-.088.036h-1.52v1.44h1.738a.124.124 0 0 1 .125.128.124.124 0 0 1-.125.127H9.482a.131.131 0 0 1-.08-.039.117.117 0 0 1-.034-.086zm4.155 0v-3.27h-1.095a.116.116 0 0 1-.088-.04.13.13 0 0 1 0-.18.12.12 0 0 1 .088-.036h2.439a.12.12 0 0 1 .088.037.13.13 0 0 1 0 .18.116.116 0 0 1-.088.039H13.77v3.27a.121.121 0 0 1-.036.089.12.12 0 0 1-.089.036.12.12 0 0 1-.088-.036.121.121 0 0 1-.036-.09zm2.492-.415a1.762 1.762 0 0 1-.552-1.309c0-.513.184-.95.552-1.309A1.86 1.86 0 0 1 17.35 10c.436 0 .827.134 1.173.402a.145.145 0 0 1 .05.09.102.102 0 0 1-.029.092.111.111 0 0 1-.086.052.116.116 0 0 1-.09-.026 1.604 1.604 0 0 0-1.018-.354 1.59 1.59 0 0 0-1.157.469 1.53 1.53 0 0 0-.477 1.132c0 .441.159.817.477 1.126.318.31.69.465 1.113.465.424 0 .774-.119 1.051-.355a.14.14 0 0 1 .101-.024.104.104 0 0 1 .08.055.112.112 0 0 1 .032.094.119.119 0 0 1-.047.089 1.868 1.868 0 0 1-1.173.396c-.522 0-.967-.18-1.336-.54zm5.732.415v-1.575h-1.868v1.575a.117.117 0 0 1-.04.089.129.129 0 0 1-.178 0 .121.121 0 0 1-.037-.09v-3.4c0-.034.012-.064.037-.088a.129.129 0 0 1 .179 0 .117.117 0 0 1 .039.088v1.575h1.868v-1.575a.12.12 0 0 1 .036-.088.129.129 0 0 1 .179 0 .117.117 0 0 1 .039.088v3.4a.117.117 0 0 1-.039.09.129.129 0 0 1-.179 0 .121.121 0 0 1-.036-.09z"></path></symbol></use></svg>
        </a>
      </div>
      <div class="flex flex-col items-center">
        <img class="rounded-full" src={owner.picture} alt="" width="120" height="120">
        <div class="flex flex-col items-center py-3">
          <div class="font-semibold text-lg">{owner.name}</div>
          <a
            href="/lives/@{owner.username}"
            class="text-sm text-blue-600 underline"
          >
            @{owner.username}
          </a>
        </div>
        {#if live.isLive}
          <a href="#live-point" class="flex items-center space-x-1 text-white bg-blue-500 rounded-full p-2 px-5 mt-2">
            <span><svg class="w-5 h-5 animate-pulse"><use xlink:href="#live"><symbol id="live" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M15.333 12A3.34 3.34 0 0 1 12 15.333 3.34 3.34 0 0 1 8.667 12 3.34 3.34 0 0 1 12 8.667 3.34 3.34 0 0 1 15.333 12zM17 12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5 5-2.24 5-5zm1.667 0A6.663 6.663 0 0 1 12 18.667 6.663 6.663 0 0 1 5.333 12 6.663 6.663 0 0 1 12 5.333 6.663 6.663 0 0 1 18.667 12zm1.666 0c0-4.596-3.737-8.333-8.333-8.333S3.667 7.404 3.667 12 7.404 20.333 12 20.333s8.333-3.737 8.333-8.333zM22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"></path></symbol></use></svg></span>
            <span class="relative bottom-[1px]">Watch LIVE</span>
          </a>
        {/if}
        <div class="pt-5 w-full border-b border-b-blue-400">
          <div class="flex justify-evenly py-2">
            <div class="flex items-center space-x-1">
              <span class="font-bold text-lg">{owner.following}</span>
              <span class="font-light text-sm">following</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="font-bold text-lg">{owner.followers}</span>
              <span class="font-light text-sm">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="live-point" class="flex flex-col space-y-2 lg:flex-row lg:space-y-0 items-start p-2 min-h-screen space-x-0 lg:space-x-2">
    <div class="flex flex-col w-full lg:w-[68%] rounded-xl bg-white">
      <div class="flex justify-between items-center p-3">
        <div class="flex items-center">
          <img class="rounded-full" src={owner.picture} alt="" width="35" height="35">
          <div class="font-bold text-xs lg:text-lg text-black truncate pl-2 lg:pl-3 w-40">{owner.name}</div>
        </div>
        <div class="flex items-center text-[#d0cac1] space-x-2">
          <div class="flex items-center">
            <svg class="w-4 lg:w-5 h-4 lg:h-5"><use xlink:href="#user-o"><symbol id="user-o" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 2.8c-2.388 0-3.703 1.199-3.703 3.376v2.172a.4.4 0 0 1-.09.252 1.172 1.172 0 0 0 .224 1.698.4.4 0 0 1 .155.22c.28.999.746 1.853 1.347 2.47a.4.4 0 0 1 .114.279v.97a.4.4 0 0 1-.018.118c-.114.369-.508.922-2.557 1.94-1.115.553-2.584 1.18-4.492 1.918a.293.293 0 0 0-.18.273v2.425c0 .16.126.289.28.289h17.838c.155 0 .282-.13.282-.29v-2.424a.293.293 0 0 0-.182-.273c-5.858-2.265-6.85-3.22-7.048-3.857a.4.4 0 0 1-.018-.12v-.97a.4.4 0 0 1 .114-.279c.6-.614 1.066-1.468 1.347-2.47a.4.4 0 0 1 .155-.22 1.173 1.173 0 0 0 .223-1.7.4.4 0 0 1-.09-.25V6.175c0-2.209-1.28-3.376-3.701-3.376M20.918 22H3.08C2.485 22 2 21.511 2 20.91v-2.424a1.1 1.1 0 0 1 .69-1.018c1.886-.73 3.333-1.347 4.426-1.89 1.69-.84 2.053-1.276 2.13-1.419v-.733c-.613-.671-1.092-1.552-1.393-2.564a1.974 1.974 0 0 1-.356-2.647v-2.04c0-1.248.39-2.29 1.13-3.013C9.414 2.39 10.549 2 12 2c1.48 0 2.624.392 3.402 1.164.73.724 1.1 1.737 1.1 3.012v2.037a1.971 1.971 0 0 1-.356 2.65c-.303 1.013-.782 1.894-1.394 2.563v.733c.077.143.441.58 2.131 1.42 1.09.54 2.537 1.158 4.423 1.888.415.16.694.57.694 1.019v2.425c0 .6-.485 1.089-1.082 1.089"></path></symbol></use></svg>
            <span class="font-semibold text-sm lg:text-base pl-1">{audiences.audienceCount}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 lg:w-5 h-4 lg:h-5"><use xlink:href="#visible-o"><symbol id="visible-o" viewBox="0 0 24 24"><path fill="currentColor" d="M2.604 12.34a17.235 17.235 0 0 0 2.374 3.227c2.045 2.181 4.397 3.478 7.022 3.478s4.977-1.297 7.022-3.478a17.235 17.235 0 0 0 2.411-3.294 15.374 15.374 0 0 0-.52-.865 17.235 17.235 0 0 0-1.891-2.43C16.977 6.798 14.625 5.5 12 5.5S7.023 6.797 4.978 8.978a17.235 17.235 0 0 0-2.411 3.295l.037.067zm-1.051-.29a7.96 7.96 0 0 1 .18-.335 18.224 18.224 0 0 1 2.516-3.42C6.466 5.93 9.057 4.5 12 4.5c2.943 0 5.534 1.43 7.751 3.794a18.224 18.224 0 0 1 2.516 3.421c.088.157.148.27.18.334a.5.5 0 0 1 0 .447 8.465 8.465 0 0 1-.18.334 18.224 18.224 0 0 1-2.516 3.42c-2.217 2.366-4.808 3.795-7.751 3.795-2.943 0-5.534-1.43-7.751-3.794a18.224 18.224 0 0 1-2.516-3.42 8.465 8.465 0 0 1-.18-.335.5.5 0 0 1 0-.447zM12 15.5a3.227 3.227 0 1 1 0-6.455 3.227 3.227 0 0 1 0 6.455zm0-1a2.227 2.227 0 1 0 0-4.455 2.227 2.227 0 0 0 0 4.455z"></path></symbol></use></svg>
            <span class="font-semibold text-sm lg:text-base pl-1">{audiences.totalAudienceCount}</span>
          </div>
          <div class="p-1 bg-red-500 rounded-lg animate-pulse text-xs font-semibold text-white">NSFW</div>
        </div>
      </div>
      <video bind:this={videoHls} autoplay>
        <track kind="captions"/>
      </video>
      <div class="p-3 text-center font-bold text-xl truncate">{live.name}</div>
    </div>
    <div class="py-2 flex items-start w-full lg:w-[31.5%] bg-white max-h-[600px] rounded-xl">
      <div class="flex flex-col w-full">
        <div class="pb-2 border-b border-gray-300 w-full text-center font-bold text-xl">
          Chat Section
        </div>
        <div id="chat" class="pt-2 px-2 space-y-2 overflow-y-auto min-h-[400px] lg:min-h-[500px] max-h-[400px] lg:max-h-[500px] text-xl"/>
      </div>
    </div>
  </div>
</div>
