<!-- ResultsFooter -->

<script setup>
  import Language from '@/composables/language.composable'
  import Version from '@/composables/version.composable'

  import { ref } from 'vue'

  const active_copyrights = ref( Language.active_copyrights )
</script>

<template>
  <VFooter 
    id="mbs_footer"
    class="rounded bg-transparent text-medium-emphasis d-flex flex-column justify-start"
    data-screen_media_only
    >
    <VDivider 
      class="w-100"
      data-screen_media_only
      />
    <span class="text-caption text-center px-2">
      * Permission to use copyrighted texts has been granted, or is pending.
      <VList
        density="compact"
        class="text-left bg-transparent"
        >
        <VListItem
          v-for="copyrights in active_copyrights"
          :key="copyrights.key"
          >
          <sup>{{ copyrights.index + 1 }}</sup>
          {{ copyrights.notice }}
        </VListItem>
      </VList>
    </span>
  </VFooter>
</template>

<style lang="sass">
#mbs_footer
  .v-list-item
    padding: 0
    &--density-compact.v-list-item--one-line
      min-height: fit-content
</style>