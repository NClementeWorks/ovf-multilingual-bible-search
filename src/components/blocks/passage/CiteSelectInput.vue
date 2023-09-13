<!-- CiteSelectInput -->

<script setup>
  import Cite from '@/composables/cite.composable'
  import bible_structure from '@/assets/js/bible_structure'
  import { computed, defineProps, ref, toRefs } from 'vue'

  const props = defineProps ({
    item_key: [ String, Number ],
  })
  const { item_key } = toRefs ( props )

  const select_book_el = ref ( null )

  const bible_books = Object.keys ( bible_structure ).map ( ( name, idx ) => ({ name, order: idx + 1 }))
  const bible_book_chapters = Object.values ( bible_structure )

  const selected = item_key?.value
    ? ref ( Cite.selected_cites_map.value [ item_key.value ] )
    : Cite.new_cite_to_add
  
  const book = ref( selected.value.content.book.name )

  //
  // Validate inputs

  const validate_verse_to = ( value ) => {
    if ( parseInt ( selected.value.content.verse_from ) > parseInt ( value ) )
      selected.value.content.verse_from = value
  }

  const validate_verse_from = ( value ) => {
    if ( parseInt ( selected.value.content.verse_to ) < parseInt ( value ) )
      selected.value.content.verse_to = value
  }

  const validate_chapter_verses = ( value ) => {
    const chapter_verses = bible_book_chapters [ selected.value.content.book.order - 1 ] [ value - 1 ]
    if ( parseInt ( selected.value.content.verse_from ) > chapter_verses )
      selected.value.content.verse_from = chapter_verses
    if ( parseInt ( selected.value.content.verse_to ) > chapter_verses )
      selected.value.content.verse_to = chapter_verses
  }

  const validate_book_chapters = ( value ) => {
    if ( !value || typeof value === 'string' )
      return

    selected.value.content.book = value
    const book_chapters = bible_book_chapters [ selected.value.content.book.order - 1 ].length
    if ( parseInt ( selected.value.content.chapter ) > book_chapters )
      selected.value.content.chapter = book_chapters
    validate_chapter_verses ( selected.value.content.chapter )
  }

  const chapter_verses = computed( () => {
    if ( bible_book_chapters ) {

      const book_chapters = bible_book_chapters [ selected.value.content?.book?.order - 1 ]
      if ( book_chapters ) {

        const verse_count = book_chapters[ selected.value.content?.chapter - 1 ]
        if ( verse_count ) {

          return Array( verse_count )
            .fill(0)
            .map ( ( c, idx ) => idx + 1 )
        }
      }
    }
    return []
  })

</script>

<template>

  <div class="cite_select">

    <VCombobox
      ref="select_book_el"
      class="cite_select_book"
      v-model="book"
      :items="bible_books"
      item-title="name"
      return-object
      :tabindex="1"
      clearable
      open-on-clear
      @update:model-value="validate_book_chapters"
      />

    <VCombobox
      class="cite_select_number"
      v-model="selected.content.chapter"
      :items="Array( bible_book_chapters [ selected.content.book.order - 1 ]?.length ).fill(0).map ( ( c, idx ) => idx + 1 )"
      :tabindex="2"
      @update:model-value="validate_chapter_verses"
      />

    :

    <VCombobox
      class="cite_select_number"
      v-model="selected.content.verse_from"
      :items="chapter_verses"
      :tabindex="3"
      @update:model-value="validate_verse_from"
      />
      
    -

    <VCombobox
      class="cite_select_number"
      v-model="selected.content.verse_to"
      :items="chapter_verses"
      :tabindex="4"
      @update:model-value="validate_verse_to"
      />
      
  </div>

</template>

<style lang="sass">
.cite_select
  display: flex
  align-items: center

  &_book
    min-width: 8rem

  &_number
    min-width: 3.5rem
</style>