<!-- CiteSelectTextInput -->

<script setup>
  import Cite from '@/composables/cite.composable'
  import bible_structure from '@/assets/js/bible_structure'
  import { computed, defineProps, ref, toRefs } from 'vue'

  const props = defineProps ({
    item_key: [ String, Number ],
  })
  const { item_key } = toRefs ( props )

  const cite = ref ( '' )
  const cite_select_el = ref ()

  const initial_book_options = Object.keys ( bible_structure )
  const bible_book_chapters = Object.values ( bible_structure )
  const current_step = ref ( 'book' )



  const options_list = computed ( () => {
    
    // match book number + name + space + chapter + colon (:)
    if ( cite_text.value?.match( /^([1-3] )?[a-zA-Z]+ [0-9]{1,3}[:.]{1}/ ) ) {
      const selected_book = cite_text.value.match( /^([1-3] )?[a-zA-Z]+/ ) [ 0 ]
      const selected_chapter = cite_text.value.match( /(?<= )[0-9]{1,3}(?=[:|.])/ ) [ 0 ]
      const chapter_verse_separator = cite_text.value.match( /[:|.]/ ) [ 0 ]
      const book_idx = initial_book_options.findIndex( book => book.toLowerCase () === selected_book?.toLowerCase ().trim () )
      const verses = bible_book_chapters [ book_idx ] [ parseInt ( selected_chapter ) - 1 ]
      const verses_array = new Array ( verses ).fill ()
      const verses_options = verses_array.map ( ( v, idx ) => `${ initial_book_options [ book_idx ] } ${ selected_chapter }${ chapter_verse_separator }${ idx + 1 }`)
      return verses_options
    }
    
    // match book number + name + space
    else if ( cite_text.value?.match( /^([1-3] )?[a-zA-Z]+ / ) ) {
      const selected_book = cite_text.value.match( /^([1-3] )?[a-zA-Z]+/ ) [ 0 ]
      const book_idx = initial_book_options.findIndex( book => {
        const book_regex = new RegExp ( selected_book?.trim (), 'i' )
        const book_result = book_regex.exec ( book )
        return !!book_result
      })
      const chapters = bible_book_chapters [ book_idx ]
      const chapters_options = chapters.map ( ( ch, idx ) => `${ initial_book_options [ book_idx ] } ${ idx + 1 }` )
      return chapters_options
    }

    else
      return initial_book_options
    // John
    // John 3 <-- on added space, add chapters
    // John 3:16 <-- on added semi-colon (:) or period (.), add verse from
    // John 3:16-17 <-- on added dash (-), add verse to
  } )

  const cite_text = computed ( {
    get () { return cite.value },
    set ( value ) {
      // if book, complete book name
      if ( value?.match( /^([1-3] )?[a-zA-Z]+ $/ ) ) {
        // select full book name
        const selected_book = value.match( /^([1-3] )?[a-zA-Z]+/ ) [ 0 ]
        const full_book_name = initial_book_options.find( book => {
          const book_regex = new RegExp ( selected_book?.trim (), 'i' )
          const book_result = book_regex.exec ( book )
          return !!book_result
        })
        cite.value = full_book_name + ' '
      }
      else
        cite.value = value
    }
  })

  const cite_keydown = ev => {
    if ( ev.key === 'Enter' ) {
      cite_select_el.value.blur ()
    }
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
      ref="cite_select_el"
      class="cite_select_text"
      v-model="cite_text"
      :items="options_list"
      :tabindex="1"
      clearable
      return-object
      open-on-clear
      hide-details="auto"
      @update:model-value="verify_selection"
      @keydown="cite_keydown"
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