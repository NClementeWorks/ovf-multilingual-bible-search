<!-- LoaderPassages -->

<script setup>
  import FAIcon from '@/components/utils/FAIcon.vue'
</script>

<template>
  <div class="loader_passages">
    <FAIcon icon="book-open" class="loader_icon pulse_animation" />
    <span class="loader_label">Loading passages...</span>
  </div>
</template>

<style lang="sass">
.loader_passages
  display: flex
  flex-direction: column
  justify-content: center
  text-align: center
</style>