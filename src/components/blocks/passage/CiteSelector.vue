<!-- CiteSelector -->

<script setup>
  import CiteSelectInput from '@/components/blocks/passage/CiteSelectInput.vue'
  
  import Cite from '@/composables/cite.composable'
  import bible_structure from '@/assets/js/bible_structure'
  import { clone_deep } from '@/composables/utils/utils.composable'
  import { defineProps, nextTick, onUpdated, ref, toRefs, watch, defineEmits } from 'vue'

  //
  // exposed properties

  const props = defineProps ({
    item_key: [ String, Number ],
    embeded: Boolean,
  })
  const {
    item_key,
    embeded,
  } = toRefs ( props )

  const emit = defineEmits ( 'open_status_changed' )

  //
  // local variables

  const internal_id = Math.floor ( Math.random () * 100 )
  const is_closed = ref ( false )
  const open_panels = ref( 'book_panel' )

  const bible_book_chapters = Object.values ( bible_structure )

  const selected = item_key?.value
    ? ref ( Cite.selected_cites_map.value [ item_key.value ] )
    : Cite.new_cite_to_add

  const original_value = clone_deep ( selected.value.content )

  watch ( is_closed, () => {
    emit ( 'open_status_changed', is_closed.value ? 'closed' : 'open' )
    if ( !is_closed.value )
      focus_current_chapter ()
  })
  //
  // scroll chapter into view on input updated

  let prev_selected = clone_deep ( selected.value.content )

  const cite_selector_chapters_box = ref ( {} )

  const focus_current_chapter = () => {
    const chapter_elements = [ ...cite_selector_chapters_box.value.children ]
    const child_to_focus = chapter_elements.find ( c =>
      parseInt ( c.getAttribute('data-chapter') ) === selected.value.content.chapter
    )

    cite_selector_chapters_box.value.scrollTo ({
        left: 0, 
        top: child_to_focus.offsetTop,
        behavior:"smooth"
    })
    // avoid using scrollIntoView since it seems to affect the entire window
    // NC 23-6-22
  }

  watch ( selected.value.content, () => {
    if ( selected.value.content.verse_from !== prev_selected.verse_from
      || selected.value.content.verse_to !== prev_selected.verse_to )
      is_initial_selection.value = false
    
    focus_current_chapter ()
  })

  onUpdated( () => {
    nextTick( () => {
      if ( prev_selected.book !== selected.value.content.book )
        focus_current_chapter ()
        
      prev_selected.book = clone_deep ( selected.value.content.book )
    })
  })

  //
  // highlight selected verses

  let is_initial_selection = item_key.value
    ? ref ( false )
    : ref ( true )

  const reset_verse_selection = () => {
    selected.value.content.book = clone_deep ( original_value.book )
    selected.value.content.chapter = clone_deep ( original_value.chapter )
    selected.value.content.verse_from = clone_deep ( original_value.verse_from )
    selected.value.content.verse_to = clone_deep ( original_value.verse_to )
    is_initial_selection.value = true
  }

  const add_selected_verse = ( verse, chapter ) => {

    if ( selected.value.content.chapter !== chapter
      || is_initial_selection.value ) {

      selected.value.content.chapter = chapter
      selected.value.content.verse_from = verse
      selected.value.content.verse_to = verse

      is_initial_selection.value = false
    }

    else if ( selected.value.content.verse_from === verse
      && selected.value.content.verse_to === verse ) {
      reset_verse_selection()
    }

    else if ( selected.value.content.verse_to < verse ) {
      selected.value.content.verse_to = verse
    }

    else if ( selected.value.content.verse_from > verse ) {
      selected.value.content.verse_from = verse
    }

    else {
      selected.value.content.verse_to = verse
    }
  }
</script>

<template>
  <!-- {{ selected.content }} -->

  <VExpansionPanels
    :id="`cite_selector_${internal_id}`"
    v-model="open_panels"
    class="cite_selector"
    :class="{
      cite_selector_closed: is_closed,
      embeded: embeded
    }"
    >
    <!-- :key="`${selected.content.book.order}_${selected.content.chapter}`" -->
    <VExpansionPanel
      elevation="1"
      rounded="sm"
      value="book_panel"
      >
      <VExpansionPanelTitle
        class="cite_selector_heading"
        tag="div"
        >
      
        <CiteSelectInput
          class="cite_selector_input"
          :item_key="item_key"
          @click.stop
          />

        <template #actions="{ expanded }">
          <VTooltip
            text="Reset values"
            >
            <template #activator="{ props }">
              <CircleBtn
                v-bind="props"
                class="cite_selector_reset_button"
                :class="{ hidden: is_closed }"
                icon="fas fa-arrow-rotate-left"
                @click.stop="reset_verse_selection"
                >
              </CircleBtn>
            </template>
          </VTooltip>

          <VTooltip
            :text="`${is_closed ? 'Open' : 'Minimize'} selector`"
            >
            <template #activator="{ props }">
              <CircleBtn
                v-bind="props"
                class="cite_selector_reset_button"
                :class="{ hidden: is_closed }"
                :icon="`fas fa-${
                  expanded
                  ? 'down-left-and-up-right-to-center'
                  : 'up-right-and-down-left-from-center'
                }`"
                >
              </CircleBtn>
              <!-- @click="open_close_panel( expanded )" -->
            </template>
          </VTooltip>
        </template>

      </VExpansionPanelTitle>
      
      <VExpansionPanelText
        class="cite_selector_content_wrapper"
        :class="{
          embeded: embeded,
        }"
        >

        <div class="cite_selector_chapters_heading">
          <div class="cite_selector_chapters_heading_chapter">Chapter</div>
          <div class="cite_selector_chapters_heading_verses">Verses</div>
        </div>
        
        <div class="cite_selector_chapters_wrapper">
          <div ref="cite_selector_chapters_box"
            class="cite_selector_chapters"
            >

            <div v-for="chapter in bible_book_chapters [ selected.content.book.order - 1 ]?.length" :key="chapter"
              :class="{
                selected: selected.content.chapter === chapter
              }"
              :data-chapter="chapter"
              >
              <div class="cite_selector_chapters_number"
                @click="add_selected_verse ( 1, chapter ); add_selected_verse ( bible_book_chapters [ selected.content.book.order - 1 ][ chapter - 1 ], chapter )"
                >{{ chapter }}:
              </div>
              <div class="cite_selector_verses">
                <div v-for="verse in bible_book_chapters [ selected.content.book.order - 1 ][ chapter - 1 ]" :key="verse"
                  @click="add_selected_verse ( verse, chapter )"
                  :class="{

                    selected: selected.content.verse_from <= verse
                      && selected.content.verse_to >= verse
                      && selected.content.chapter === chapter,

                    initial: is_initial_selection

                  }"
                  >
                  {{ verse }}
                </div>
              </div>
            </div>
          </div>

          <div class="cite_selector_chapters_background cite_selector_chapters_background_top"></div>
          <div class="cite_selector_chapters_background cite_selector_chapters_background_bottom"></div>
        </div>
      </VExpansionPanelText>

    </VExpansionPanel>
  </VExpansionPanels>
</template>

<style lang="sass">
#mbs_main_container
  
  .cite_selector
    width: fit-content
    background: rgb( var( --v-theme-surface-lighten-1 ) )
    color: #000
    display: flex
    flex-direction: column
    border-radius: .25rem
    position: relative
    z-index: 1
    transition: .3s ease all
    position: relative
    font-weight: normal
    font-size: 1rem

    .v-expansion-panel-title__overlay
      background: transparent

    &_content_wrapper
      top: 3rem
      left: 0
      width: 100%
      display: block
      background: rgb( var( --v-theme-surface-lighten-1 ) )
      z-index: 1
      font-size: .8rem
      position: absolute
      border-bottom-left-radius: .25rem
      border-bottom-right-radius: .25rem
      box-shadow: 0 1.5rem 3rem #8881, 0 .15rem .15rem #0003

      &.embeded
        position: relative
        top: 0

    &_heading
      display: flex
      justify-content: space-between
      padding: 1rem

      .cite_selector_closed &    
        justify-content: flex-start
        padding: .25rem

    &_reset_button
      font-size: .8rem
      padding: .3rem .5rem .25rem
      background: transparent
      color: #0007
      margin-left: .25rem
      border: 1px solid #9997

      &:hover
        color: #fff
        background: #0006

      &.hidden
        display: none

      .cite_selector_closed &
        margin-left: .5rem

    &_chapters
      overflow: auto
      height: 10rem
      display: flex
      flex-direction: column
      align-items: center
      transition: .3s ease height

      &_wrapper
        position: relative

      .cite_selector_closed &
        height: 0
        transition: .3s ease height

      &::-webkit-scrollbar
        width: .5rem
      &::-webkit-scrollbar-track
        background: transparent
        border-bottom-right-radius: .25rem
        &:hover
          background: rgb( var( --v-theme-surface-lighten-1  ) )
      &::-webkit-scrollbar-thumb
        background: rgb( var( --v-theme-surface-darken-1 ) )
        border-radius: .25rem
        &:hover
          background: rgb( var( --v-theme-surface-darken-2 ) )

      &_heading
        display: flex
        font-size: .6rem
        padding-bottom: .15rem
        transition: .3s ease all
        opacity: .8
        justify-content: center
        line-height: 1

        .cite_selector_closed &
          height: 0
          overflow: hidden
          padding-bottom: 0
          opacity: 0
          transition: .3s ease all

        &_chapter
          min-width: 1rem
          padding-right: .25rem
          border-right: 1px solid #888

        &_verses
          padding-left: .25rem
          width: calc( 15rem + 13px)

      & > div
        display: flex

        &.selected
          background: #fff7
          border-radius: .25rem

      &_number
        min-width: 1rem
        height: 1.5rem
        display: flex
        align-items: center
        justify-content: flex-end
        padding: 0 .5rem 0 1rem  
        font-weight: bold
        cursor: pointer
        z-index: 1
        position: relative

        &:hover
          color: #fff
          
          &::before
            content: ''
            position: absolute
            background: rgb( var( --v-theme-blue_deep ) ) //saturate(darken(cornflowerblue, 35), 35)
            width: 1.5rem
            height: 1.5rem
            border-radius: 100%
            z-index: -1
            left: .75rem
        
      &_background
        display: block
        position: absolute
        left: 0
        width: 100%
        height: 1rem
        z-index: -1
        transition: .3s ease all
        opacity: 1

        &_top
          background-image: linear-gradient( rgb( var( --v-theme-surface ) ), transparent )
          // background-image: linear-gradient( transparentize( darken( cornflowerblue, 50 ), .9 ), transparent )
          top: 0
        &_bottom
          bottom: 0
          background-image: linear-gradient( transparent, rgb( var( --v-theme-surface ) ) )
          // background-image: linear-gradient( transparent, transparentize( darken( cornflowerblue, 50 ), .9 ) )
          border-bottom-left-radius: .25rem
          border-bottom-right-radius: .25rem

        .cite_selector_closed &
          height: 0
          opacity: 0

    &_verses
      display: flex
      flex-wrap: wrap
      border-top: 1px solid #6667
      border-left: 1px solid #6667
      width: calc( 15rem + 13px )

      & > div
        width: 1.5rem
        height: 1.5rem
        border: 1px solid #ccc
        border-top-color: transparent
        border-left-color: transparent
        display: flex
        align-items: center
        justify-content: center
        cursor: pointer

        &.selected
          color: #fff
          position: relative
          font-weight: bold
          z-index: 1

          &::before
            content: ''
            position: absolute
            background: rgb( var( --v-theme-blue_deep-darken-1 ) )
            // background: saturate(darken(cornflowerblue, 35), 35)
            width: 90%
            height: 90%
            border-radius: 100%
            z-index: -1
            // opacity: .6

          &.initial
            color: #000
            background: transparent
            border-color: rgb( var( --v-theme-blue_deep-darken-1 ) )
            border-radius: 100%

            &::before
              content: none

</style>