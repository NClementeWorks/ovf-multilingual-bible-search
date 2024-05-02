<!-- CiteSelectTextInput -->

<script setup>
  import Cite from '@/composables/cite.composable'
  import bible_structure from '@/assets/js/bible_structure'
  import { computed, defineProps, ref, toRefs } from 'vue'

  const props = defineProps ({
    item_key: [ String, Number ],
  })
  const { item_key } = toRefs ( props )

  const cite_text = ref ( { text: '' } )

  const initial_book_options = Object.keys ( bible_structure ).map ( ( book, idx ) => ({ text: book, order: idx + 1 }))
  const bible_book_chapters = Object.values ( bible_structure )
  const current_step = ref ( 'book' )

  const next_cites = computed ( () => {
    return initial_book_options
    // John
    // John 3 <-- on added space, add chapters
    // John 3:16 <-- on added semi-colon (:) or period (.), add verse from
    // John 3:16-17 <-- on added dash (-), add verse to
  } )

  const cite_keydown = ev => {
    console.log ('cite_keydown', ev)
    // if space
    // select book and append book chapters
    // if semi-colon (:) or period (.)
    // select book>chapter and append verse-from
    // if dash (-)
    // select book>chapter>verse-from and append verse-to
  }

  const verify_selection = ev => {
    // validate_book_chapters ()
    // on book selected
    // add space and go to chapter selection...
  }

</script>

 <template>

  <div class="cite_select">

    <VCombobox
      ref="cite_select_text"
      class="cite_select_text"
      v-model="cite_text"
      :items="next_cites"
      item-title="text"
      :tabindex="1"
      clearable
      return-object
      open-on-clear
      hide-details="auto"
      @keydown="cite_keydown"
      @update:model-value="verify_selection"
      />

  </div>

</template>

<style lang="sass">
.cite_select_text
  display: flex
  align-items: center
  min-width: 12rem

  &_book
    min-width: 8rem

  &_number
    min-width: 3.5rem
</style>