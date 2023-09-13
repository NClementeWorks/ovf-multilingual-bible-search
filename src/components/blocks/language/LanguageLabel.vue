<!-- LanguageLabel -->

<script setup>
  import Version from '@/composables/version.composable'
  import Language from '@/composables/language.composable'
  import { computed, defineProps, toRefs } from 'vue'
  
  const props = defineProps ({
    item_key: [ String, Number ],
    font_size: String,
  })
  
  const {
    item_key,
    font_size,
  } = toRefs ( props )

  const item = Language.selected_languages_map.value [ item_key.value ]

  const copyrights_footnote = computed( () => {
    const active_copyrights = Language.active_copyrights.value.find( cp => cp.key === parseInt( item_key.value ) )
    if ( active_copyrights )
      return active_copyrights.index + 1
    return 0
  })
  
</script>

<template>

  <div
    class="language_label"
    data-screen_media_only
    :style="{
      fontSize: font_size,
    }"
    >
    <span class="language_label_name">{{ Language.all_languages_map.value [ item.content.id ]?.name?.trim() }}</span>
    <span
      class="language_label_version"
      >
      ({{ Version.all_versions_map.value [ item.content.version ].code.trim() }})
      <VTooltip
        :text="Version.all_versions_map_by_language.value [ item.content.id ] [ 0 ].name.trim()"
        location="top"
        activator="parent"
        />
    </span>
    <sup
      v-if="copyrights_footnote"
      class="text-caption text-medium-emphasis">
      {{ copyrights_footnote }}
    </sup>
  </div>

</template>

<style lang="sass">
.language_label
  display: flex
  align-items: center
  justify-content: space-between
  text-wrap: nowrap

  &_version
    font-size: .8em
    margin-left: .5rem
    opacity: .6
</style>