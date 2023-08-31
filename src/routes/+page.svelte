<script lang="ts">
	import { goto } from "$app/navigation";


  let url: string = "";
  let errMsg: string = "";
  let outlineColor: string = "focus:border-blue-500 dark:focus:border-blue-500";
  let submitUrl: string = "";
  let submitting: boolean = false;
  let submitCount: number = 0;

  const onInputChange = () => {
    submitUrl = ""
    submitCount = 0
  }

  const submitLive = () => {
    if(submitting) return;
    if(url === "") {
      errMsg = "Input URL cannot be empty!"
      outlineColor = "focus:border-red-600 dark:focus:border-red-600";
      return;
    }

    const pattern = /^https:\/\/(?:www\.)?sketch\.pixiv\.net\/.*\/(\d+)$/;
    const liveurlMatched = url.match(pattern);

    if(liveurlMatched) {
      if(submitCount > 0 && (url === submitUrl)) return;

      submitUrl = url;
      submitCount++;
      outlineColor = "focus:border-green-500 dark:focus:border-green-500";
      submitting = true;

      const liveId = liveurlMatched[1];
      const form = new FormData();
      form.append("liveId", liveId);

      fetch("/api/lives", {method: "POST", body: form})
        .then(res => res.json())
        .then(json => {
          if(json.status !== 200) {
            submitting = false;
            outlineColor = "focus:border-red-600 dark:focus:border-red-600";
            errMsg = json.message;
          }
          goto(`/lives/@${json.data.owner.username}`)
        })
        .catch(_ => {
          submitting = false;
        })

    } else {
      errMsg = "Invalid Pixiv LIVE URL!";
      outlineColor = "focus:border-red-600 dark:focus:border-red-600";
      return;
    }
  }

  $: if(url === "") {
    errMsg = "";
    outlineColor = "focus:border-blue-500 dark:focus:border-blue-500";
  }
</script>

<div
  class="absolute top-0 left-0 min-h-screen w-full bg-cover bg-no-repeat"
  style="background-image: url(/hero.jpg);"
>
  <div class="transition-[backdrop-filter] duration-200 ease-out flex flex-col justify-center items-center lg:items-start p-10 text-black dark:text-white min-h-screen lg:space-y-10 backdrop-blur-lg lg:backdrop-blur-sm backdrop-brightness-50 lg:backdrop-brightness-100">
    <div class="flex flex-col items-center space-y-7">
      <div class="space-y-3 flex flex-col items-center select-none">
        <div
          class="uppercase tracking-widest text-5xl lg:text-[5rem] xl:text-8xl font-extrabold bg-gradient-to-r from-blue-400 to-[#96d0ff] from-25% to-75%"
          style="background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
        >
          Pixiv LIVE
        </div>
        <div class="text-xs lg:text-sm xl:text-lg font-semibold max-w-[300px] lg:max-w-[450px] xl:max-w-[550px] text-center">
          Watch your favorite artist LIVE on Pixiv LIVE, just copy the LIVE URL on Pixiv Sketch then paste it below!
        </div>
      </div>
      <form on:submit|preventDefault={submitLive}>
        <div class="relative w-[20rem] lg:w-[25rem] xl:w-[30rem] box-border grow-0 flex justify-center">
          <input
            class="h-8 lg:h-9 xl:h-[2.5rem] text-[10px] lg:text-sm xl:text-base text-left pr-[2.5rem] appearance-none resize-none box-border w-full transition-all duration-200 ease-in-out text-black dark:text-white placeholder:text-black placeholder:dark:text-gray-400 bg-white dark:bg-[#25262bc1] block border border-[#ced4da] dark:border-[#373A40] rounded-lg focus:outline-none {outlineColor} dark:focus:outline-none {outlineColor}"
            style="padding-left: calc(2.25rem / 3);" bind:value={url} required on:input={onInputChange}
            placeholder="Insert Pixiv LIVE URL..." aria-haspopup="dialog" aria-expanded="false" aria-invalid="false"
          >

          {#if !submitting}
            <button
              class="absolute top-0 right-0 flex items-center justify-center w-[2.25rem] h-full dark:text-white"
              on:click={submitLive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-search" style="display:block;opacity:0.5"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
            </button>
          {:else}
            <div class="absolute top-0 right-0 flex items-center justify-center w-[2.25rem] h-full dark:text-white">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
          {/if}
        </div>
        {#if errMsg !== ""}
          <div class="flex justify-end items-center mt-1">
            <div class="text-center text-xs px-1 rounded-sm bg-red-600">{errMsg}</div>
          </div>
        {/if}
      </form>
    </div>
  </div>
</div>
