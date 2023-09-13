<!-- PassageDisplay -->

<script setup>
  import { bible_books_map } from '@/composables/utils/utils.composable'
  import Language from '@/composables/language.composable'
  import Version from '@/composables/version.composable'
  import PassageGrouping from '@/composables/passage_grouping.composable'
  import Layout from '@/composables/layout.composable'

  import { computed, defineProps, toRefs } from 'vue'

  const props = defineProps({
    passage: Object,
    version: Object,
  })
  const {
    passage,
    version,
  } = toRefs( props )
  
  const copyrights_footnote = computed( () => {
    const active_copyrights = Language.active_copyrights.value.find( cp => cp.key === parseInt( passage.value.version_key ) )
    if ( active_copyrights )
      return active_copyrights.index + 1
    return 0
  })
</script>

<template>
  <div
    :dir="Language.all_languages_map.value [ version?.language_id ].script.direction"
    :class="{
      [ `script_${Language.all_languages_map.value [ version?.language_id ].script.code}` ]: true
    }"
    >

    <h4
      class="passage_cite_full"
      :style="{
        fontSize: `${ Layout.passage_font_sizes.value.scripts [ Language.all_languages_map.value [ version?.language_id ].script.code ].title.points_value }pt`,
      }"
      data-print_media_only
      >
      {{
        bible_books_map [ passage.book_number ]
      }} {{
        passage.chapters [ 0 ].number
      }}:{{
        passage.chapters [ 0 ].verses [ 0 ].start_number
      }}{{
        passage.chapters [ 0 ].verses [ 0 ].start_number
        !== passage.chapters [ 0 ].verses[ passage.chapters[0].verses.length - 1 ].end_number
        ? `-${passage.chapters [ 0 ].verses[ passage.chapters[0].verses.length - 1 ].end_number}`
        : ''
      }} ({{
        Version.all_versions_map.value [ passage.version_id ].code.trim()
      }}) - {{
        Language.all_languages_map.value [ Version.all_versions_map.value [ passage.version_id ].language_id ].name.trim()
      }}
      
      <sup
        v-if="PassageGrouping.grouping_option.value === 'passage' && copyrights_footnote"
        class="text-caption text-medium-emphasis"
        >
        {{ copyrights_footnote }}
      </sup>
    </h4>

    <div
      class="passage_content"
      :style="{
        fontSize: `${ Layout.passage_font_sizes.value.scripts [ Language.all_languages_map.value [ version?.language_id ].script.code ].content.points_value }pt`,
      }"
      >
      <span v-for="verse in passage.chapters[0].verses" :key="verse.number">
        <span
          class="passage_verse_number"
          :style="{
            fontSize: `${ Layout.passage_font_sizes.value.scripts [ Language.all_languages_map.value [ version?.language_id ].script.code ].content.points_value - 2 }pt`,
          }"
          >
          {{
            verse.start_number
          }}{{
            verse.start_number !== verse.end_number
            ? `-${verse.end_number}`
            : null
          }}
        </span>
        <span>{{ verse.text_content }}</span>
      </span>
    </div>
  </div>
</template>

<style lang="sass">
.passage

  &_content
    padding: .5rem 0
    line-height: 1.5
    font-size: 10pt

  &_verse_number
    font-weight: bold
    margin: 0 .25rem
    color: darken( desaturate( cornflowerblue, 50 ), 15 )
    // font-size: 8pt

</style>