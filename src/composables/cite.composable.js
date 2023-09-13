import Passage from '@/composables/passage.composable'
import { clone_deep } from '@/composables/utils/utils.composable'

import { ref } from 'vue'

const selected_cites = ref ( [] )
const selected_cites_map = ref ( {} )
let selected_cites_last_key = 0
const new_cite_to_add = ref ({
  content: {
    book: { order: 1, name: 'Genesis' },
    chapter: 1,
    verse_from: 1,
    verse_to: 1
  }
})

function update_selected_cites_map () {
  selected_cites_map.value = selected_cites.value.reduce ( ( obj, cite ) => ({
    ...obj,
    [ cite.key ]: cite,
  }), {})
}

function add_selected_cite ( new_value ) {
  new_value.key = selected_cites_last_key++

  selected_cites.value.push ( clone_deep( new_value ) )
  update_selected_cites_map ()

  Passage.get_passages_for_cite( new_value )
}

function remove_selected_cite ( item ) {
  const value_index = selected_cites.value
    .findIndex ( val => val.key === item.key )

  selected_cites.value.splice (
    value_index,
    1
  )

  Passage.remove_passages_for_cite( item )
  update_selected_cites_map  ()
}


export default {

  selected_cites,
  selected_cites_map,
  selected_cites_last_key,
  new_cite_to_add,

  add_selected_cite,
  remove_selected_cite,

}