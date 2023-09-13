// import { useDisplay } from 'vuetify'
import { computed, ref } from "vue"

import { useLocalStorage } from '@vueuse/core'

const expanded_side_panel = ref ( true )

// Font Sizes
const min_font_size = 6
const max_font_size = 72

const passage_font_sizes = useLocalStorage( 'ovf_mbs__passage_font_sizes', {
  global: {
    // using points for enhanced printing compatibility
    title: { points_value: 12 },
    content: { points_value: 9 },
  },
  scripts: {},
  languages: {},
})

function add_script_font_size ( script_code ) {
  console.log('add_script_font_size', script_code, passage_font_sizes.value)

  if ( !passage_font_sizes.value.scripts [ script_code ] )
    passage_font_sizes.value.scripts [ script_code ] = {
      title: {
        points_value: passage_font_sizes.value.global.title.points_value,
        updated: false,
      },
      content: {
        points_value: passage_font_sizes.value.global.content.points_value,
        updated: false,
      },
    }

}

/**
 * Side panel
 */

const side_panel_horizontal_height_closed = `45px`
const side_panel_horizontal_height_open = `calc( 100vh - 2rem )`
const side_panel_horizontal_height = ref( side_panel_horizontal_height_closed )

const side_panel_is_open = computed( () =>
  side_panel_horizontal_height.value === side_panel_horizontal_height_open
)

function close_side_panel() {
  side_panel_horizontal_height.value = side_panel_horizontal_height_closed
}

function open_side_panel() {
  side_panel_horizontal_height.value = side_panel_horizontal_height_open
}


export default {

  expanded_side_panel,
  passage_font_sizes,
  min_font_size,
  max_font_size,
  add_script_font_size,

  side_panel_horizontal_height_closed,
  side_panel_horizontal_height_open,
  side_panel_horizontal_height,
  side_panel_is_open,
  close_side_panel,
  open_side_panel,
}
