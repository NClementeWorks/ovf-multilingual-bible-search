import XHR from '@/composables/utils/xhr.composable'
import Errors from '@/composables/utils/errors.composable'
import Language from '@/composables/language.composable'
import Cite from '@/composables/cite.composable'
import PassageGrouping from '@/composables/passage_grouping.composable'
import { clone_deep } from '@/composables/utils/utils.composable'

import { ref } from "vue"

// Passage composable

const _new = (
  new_order,
  new_id,
  new_book,
  // new_from,
  // new_to,
  new_chapters,
) => {

  const order = ref ( new_order | 0 )
  const id = ref ( new_id )
  const book = ref ( new_book )
  const chapters = ref ( new_chapters )
  
  return {
    order,
    id,
    book,
    chapters,
  }
}

const retrieve = async ( passages, versions ) => {

  const passages_str = passages.join ( ',' )
  const versions_str = versions.join ( ',' )
  
  const xhr = XHR.new ()
  const passages_res = await xhr.get ( `passages/${ passages_str }/versions/${ versions_str }` )
  
  if ( !passages_res ) {
    alert ( 'Error loading passages' )
  }

  return passages_res.data.passages
}


const passages_details = ref ( [] )
const passages_loaded = ref ( true )

async function retrieve_passages ( cites, versions, callback ) {
    
  if ( !cites?.length
    || !versions?.length)
    return
    
  passages_loaded.value = false

  const cites_arr = cites.map ( cite =>
    get_cite_str ( cite.content )
  )
  const versions_arr = versions.map ( ver => ver.content?.version )

  const passages_res = await retrieve (
      cites_arr,
      versions_arr
    )
    .catch(err => {
      const message = 'Error loading passages'
      console.error(message, err)
      Errors.error_messages.value.push ({
        message,
        error: err
      })
    })

  if ( callback )
    callback( passages_res )

  passages_loaded.value = true
}

async function get_passages ( cites, versions ) {

  retrieve_passages ( cites, versions,
    ( passages_res ) => {

      loop_results( cites, versions, passages_res,
        ( res ) => {
          passages_details.value.push ( ref ( res ) )
        })

        PassageGrouping [ `group_passages_by_${ PassageGrouping.grouping_option.value }` ]()
    })
}

async function get_passages_for_version ( version ) {
  get_passages ( Cite.selected_cites.value, [ version ] )
}

async function get_passages_for_cite ( cite ) {
  get_passages ( [ cite ], Language.selected_languages.value )
}


function loop_results ( cites, versions, passages_res, callback ) {
  const id_match_str = /[\d]+_[\d]+_[\d]+-[\d]+$/
  
  cites.forEach( cite => {
        
    versions.forEach( version => {
      
      passages_res.every( res => {
        
        const cite_str = get_cite_str ( cite.content )
        if ( version.content.version ===  res.version_id
          && cite_str.match ( id_match_str )?.at ( 0 )
          === res.id.match ( id_match_str )?.at ( 0 ) ) {

          const res_to_add = clone_deep ( res )

          res_to_add.cite_key = cite.key
          res_to_add.version_key = version.key

          if ( callback )
            callback ( res_to_add )
          return false // stop loop
        }

        return true // continue loop
      })
    })
  })
}

function remove_passages_for_cite ( cite ) {
  passages_details.value = passages_details.value
    .filter( psg => psg.value.cite_key !== cite.key )
  PassageGrouping [ `group_passages_by_${ PassageGrouping.grouping_option.value }` ]()
}

function remove_passages_for_version ( version ) {
  passages_details.value = passages_details.value
    .filter( psg => psg.value.version_key !== version.key )
  PassageGrouping [ `group_passages_by_${ PassageGrouping.grouping_option.value }` ]()
}




function update_passages ( cites, versions ) {
  retrieve_passages (
    cites,
    versions,

    ( passages_res ) => {

      loop_results (
        cites ,
        Language.selected_languages.value, 
        passages_res,
        ( res ) => {
          
          const passage_idx = passages_details.value
          .findIndex ( psg => 
            psg.value.cite_key === res.cite_key
            && psg.value.version_key === res.version_key
          )

          let passage = passages_details.value [ passage_idx ]
          passage.value = res

        })
        
      PassageGrouping [ `group_passages_by_${ PassageGrouping.grouping_option.value }` ]()
    }
  )
}

function update_passages_for_cite ( cite ) {
  update_passages ( [ cite ], Language.selected_languages.value )
}

function update_passages_for_version ( version ) {
  update_passages ( Cite.selected_cites.value, [ version ] )
}



const get_cite_str = ( cite ) => {
  return `${ cite.book.order }_${ cite.chapter }_${ cite.verse_from }-${ cite.verse_to }` 
}

export default {

  new: _new,
  retrieve,

  passages_details,
  passages_loaded,

  get_passages_for_cite,
  get_passages_for_version,

  remove_passages_for_cite,
  remove_passages_for_version,

  update_passages_for_cite,
  update_passages_for_version,

  get_cite_str,

}