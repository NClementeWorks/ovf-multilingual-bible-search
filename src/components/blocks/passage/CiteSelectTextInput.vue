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

  const selected = item_key?.value
    ? ref ( Cite.selected_cites_map.value [ item_key.value ] )
    : Cite.new_cite_to_add
  
  const initial_book_options = Object.keys ( bible_structure )
  const bible_book_chapters = Object.values ( bible_structure )
  const current_step = ref ( 'book' )

  const book_regex = /^([1-3] )?[a-zA-Z]+ /
  const book_chapter_regex = /^([1-3] )?[a-zA-Z]+ [0-9]{1,3}[:.]{1}/
  const book_chapter_verse_regex = /^([1-3] )?[a-zA-Z]+ [0-9]{1,3}[:.]{1}[0-9]{1,3}(‐|‑|-|–|—|―)/

  const extract_from_string = ( value, regex ) => {
    const res = value?.trim ()?.match ( regex )
    return res && res [ 0 ]
  }
  // match number + name + space
  const extract_book_name = value => extract_from_string ( value, /^([1-3] )?[a-zA-Z]+/ )
  // match space + chapter + colon (:) | dot (.)
  const extract_chapter_number = value => extract_from_string ( value, /(?<= )[0-9]{1,3}(?=[:.])/ )
  // Including colon and period as the most common chapter-verse separators
  const extract_chapter_verse_separator = value => extract_from_string ( value, /[:.]/ )
  // match colon (:) | dot (.) + verse + dash (-)
  const extract_first_verse_number = value => extract_from_string ( value, /(?<=[:.])[0-9]{1,3}(?=(‐|‑|-|–|—|―))/ )
  // Including all dash type: Hyphen, Non-Breaking Hyphen, Dash, En Dash, Em Dash, Horizontal Bar
  const extract_verses_separator = value =>  extract_from_string ( value, /(‐|‑|-|–|—|―)/ )
  // match dash (-) + number
  const extract_last_verse_number = value => extract_from_string ( value, /(?<=(‐|‑|-|–|—|―))[0-9]{1,3}$/ )

  const get_book_index = book_name => {
    const book_regex = new RegExp ( book_name?.trim (), 'i' )
    return initial_book_options.findIndex ( book => !!book_regex.exec ( book ) )
  }

  const options_list = computed ( () => {
    
    let options = []

    // John 3:16-17 <-- on added dash (-), add last verse to options
    if ( cite_text.value?.match( book_chapter_verse_regex ) ) {
      const selected_book = extract_book_name ( cite_text.value )
      const selected_chapter = extract_chapter_number ( cite_text.value )
      const chapter_verse_separator = extract_chapter_verse_separator ( cite_text.value )
      const selected_first_verse = parseInt ( extract_first_verse_number ( cite_text.value ) )
      const verses_separator = extract_verses_separator ( cite_text.value )

      const book_idx = get_book_index ( selected_book )
      const verses = bible_book_chapters [ book_idx ] [ parseInt ( selected_chapter ) - 1 ]
      const verses_array = new Array ( verses - selected_first_verse ).fill ()
      options = verses_array.map ( ( v, idx ) => `${ initial_book_options [ book_idx ] } ${ selected_chapter }${ chapter_verse_separator }${ selected_first_verse }${ verses_separator }${ selected_first_verse + idx + 1 }`)
    }

    // John 3:16 <-- on added semi-colon (:) or period (.), add first verse to options
    else if ( cite_text.value?.match( book_chapter_regex ) ) {
      const selected_book = extract_book_name ( cite_text.value )
      const selected_chapter = extract_chapter_number ( cite_text.value )
      const chapter_verse_separator = extract_chapter_verse_separator ( cite_text.value )

      const book_idx = get_book_index ( selected_book )
      const verses = bible_book_chapters [ book_idx ] [ parseInt ( selected_chapter ) - 1 ]
      const verses_array = new Array ( verses ).fill ()
      options = verses_array.map ( ( v, idx ) => `${ initial_book_options [ book_idx ] } ${ selected_chapter }${ chapter_verse_separator }${ idx + 1 }`)
    }
    
    // John 3 <-- on added space, add chapters to options
    else if ( cite_text.value?.match( book_regex ) ) {
      const selected_book = extract_book_name ( cite_text.value )
      const book_idx = get_book_index ( selected_book )
      const chapters = bible_book_chapters [ book_idx ]
      options = chapters.map ( ( ch, idx ) => `${ initial_book_options [ book_idx ] } ${ idx + 1 }` )
    }

    // John <-- when only the book name, show full books list
    else
      options = initial_book_options

    return options
  } )

  const cite_text = computed ( {
    get () { return cite.value },
    set ( value ) {
      
      const selected_book = extract_book_name ( value )
      const book_idx = get_book_index ( selected_book )
      const full_book_name = initial_book_options [ book_idx ]

      // if book, complete book name
      if ( value?.match( /^([1-3] )?[a-zA-Z]+ $/ ) ) {
        // select full book name
        cite.value = full_book_name + ' '
      }
      else
        cite.value = value

      const selected_first_verse = parseInt ( extract_from_string ( value, /(?<=[:.])[0-9]{1,3}/ ) )
      selected.value.content.book.name = full_book_name
      selected.value.content.book.order = book_idx + 1
      selected.value.content.chapter = extract_from_string ( value, /(?<= )[0-9]{1,3}/ ) || 1
      selected.value.content.verse_from = selected_first_verse || 1
      selected.value.content.verse_to = parseInt ( extract_last_verse_number ( value ) )
        || ( selected_first_verse
          ? selected.value.content.verse_from
          : bible_book_chapters [ book_idx ] [ parseInt ( selected.value.content.chapter ) - 1 ] )
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

  const cite_rules = [
    value => {
      const regex = new RegExp ( value?.trim (), 'i' )
      const result = options_list.value.find ( option => {
        const res = regex.exec ( option )
        return res && res [ 0 ]
      } )
      return !!result || `No passage found for: "${ value }"`
    }
  ]

</script>

 <template>

  <div class="cite_select cite_selector_heading">

    <VCombobox
      ref="cite_select_el"
      class="cite_select_text"
      v-model="cite_text"
      :items="options_list"
      :tabindex="1"
      auto-select-first
      clearable
      open-on-clear
      hide-details="auto"
      :rules="cite_rules"
      @update:model-value="verify_selection"
      @keydown="cite_keydown"
      >
      <template #no-data>
        No Passages Found
      </template>
    </VCombobox>

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