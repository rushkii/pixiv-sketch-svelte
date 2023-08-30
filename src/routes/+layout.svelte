<script lang="ts">
  import "../app.css";
</script>


<div class="container">
  <slot/>
</div>


<style>
  .container {
    @apply flex justify-center items-center w-full min-h-screen;
  }
</style>
