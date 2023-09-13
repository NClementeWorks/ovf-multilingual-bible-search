import Passage from '@/composables/passage.composable'
import Cite from '@/composables/cite.composable'

import { ref } from 'vue'

  const grouping_option = ref ( 'language' ) // language | passage
  const passages_grouped = ref ( {} )
  const by_verse = ref ( false )

  function group_passages_by_language () {
    console.log('group_passages_by_language...')
    passages_grouped.value = Passage.passages_details.value
      .reduce ( ( obj, psg ) => ({
        ...obj,
        [ psg.value.version_key ]: obj [ psg.value.version_key ] // level 1
          ? {
            ...obj [ psg.value.version_key ], // level 2
            [ psg.value.cite_key ]: 
              by_verse.value
              ? get_passage_verses_map ( psg )
              : {
                  passage: psg
                }
          }
          : {
            [ psg.value.cite_key ]: 
              by_verse.value
              ? get_passage_verses_map ( psg )
              : {
                  passage: psg
                }
          }
      }), {} )
  }

  function group_passages_by_passage () {
    console.log('group_passages_by_passage...')
    passages_grouped.value = Passage.passages_details.value
      .reduce ( ( obj, psg ) => ({
        ...obj,
        [ psg.value.cite_key ]: // level 1
          by_verse.value
          ? Object.entries( get_passage_verses_map ( psg ) ) // level 2
            .reduce ( ( psg_map, [ key , passage] ) => ({
              ...psg_map,
              [ key ]: obj [ psg.value.cite_key ] && obj [ psg.value.cite_key ] [ key ]
                ? {
                  ...obj [ psg.value.cite_key ] [ key ],
                  [ psg.value.version_key ]: passage // level 3
                }
                : {
                  [ psg.value.version_key ]: passage
                }
            }), {})
          : {
            passage: obj [ psg.value.cite_key ] && obj [ psg.value.cite_key ].passage
              ? {
                ...obj [ psg.value.cite_key ].passage,
                [ psg.value.version_key ]: psg
              }
              : {
                [ psg.value.version_key ]: psg
              }
          }
      }), {} )
  }

  function get_passage_verses_map ( passage ) {
    return get_verses_array ( passage.value.cite_key )
      .reduce ( (verses_obj, verse) => ({
        ...verses_obj,
        [ verse.focus_verse ]: {
          ...passage.value,
          chapters: passage.value.chapters.map ( chapter => ({
            ...chapter,
            verses: chapter.verses
              .filter( v => verse.focus_verse === parseInt ( v.start_number )
                || verse.focus_verse === parseInt ( v.end_number )
              )
          }))
        }
    }), {})
  }

  
  function get_verses_array ( cite_key ) {
    const cite = Cite.selected_cites_map.value [ cite_key ]
    
    const verse_numbers = new Array ( cite.content.verse_to - cite.content.verse_from + 1 )
      .fill( 0 )
      .map( ( v, idx ) => ({
        ...cite.content,
        focus_verse: idx + cite.content.verse_from,
        cite_key: cite.key,
      })
    )

    return verse_numbers
  }

export default {

  grouping_option,
  by_verse,
  passages_grouped,

  group_passages_by_passage,
  group_passages_by_language,

}