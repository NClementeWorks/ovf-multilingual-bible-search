<!-- CiteLabel -->

<script setup>
  import { bible_books_map } from '@/composables/utils/utils.composable'
  import Cite from '@/composables/cite.composable'
  
  import { defineProps, toRefs } from 'vue'
  
  const props = defineProps ({
    item_key: [ String, Number ],
    font_size: String,
  })
  
  const {
    item_key,
    font_size,
  } = toRefs ( props )

  const item = Cite.selected_cites_map.value [ item_key.value ]

</script>

<template>
  <span
    class="cite_label"
    data-screen_media_only
    :style="{
      fontSize: font_size,
    }"
    >

      {{ bible_books_map [ item.content.book.order ] }}
      {{ item.content.chapter }}:{{ item.content.verse_from }}{{
        item.content.verse_from != item.content.verse_to
          ? `- ${ item.content.verse_to }`
          : ''
      }}

  </span>
</template>

<style lang="sass">
.cite_label
  display: flex
  align-items: center
  justify-content: space-between
  text-wrap: nowrap
</style>