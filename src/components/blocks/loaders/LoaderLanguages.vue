<!-- LoaderLanguages -->

<script setup>
  import FAIcon from '@/components/utils/FAIcon.vue'
</script>

<template>
  <div class="loader_languages">
    <FAIcon icon="globe" class="pulse_animation" />
    <h3>Loading languages...</h3>
  </div>
</template>

<style lang="sass">
.loader_languages
  display: flex
  flex-direction: column
  justify-content: center
  text-align: center
</style>