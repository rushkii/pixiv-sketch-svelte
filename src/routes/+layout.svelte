<script lang="ts">
  import "../app.css";
</script>


<div class="container">
  <slot/>
</div>


<style>
  .container {
    @apply w-full min-h-screen;
  }
</style>
