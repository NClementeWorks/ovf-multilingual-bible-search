import XHR from '@/composables/utils/xhr.composable'
import Errors from '@/composables/utils/errors.composable'
import { ref } from "vue"

// Version composable
const _new = ( new_code, new_name, new_name_native ) => {

  const code = ref(new_code)
  const name = ref(new_name)
  const name_native = ref(new_name_native)
  
  return {
    code,
    name,
    name_native,
  }
}


async function retrieve_all() {

  const xhr = XHR.new ()
  const versions_res = await xhr.get ( 'bible_versions' )

  if ( !versions_res ) {
    alert ( 'Error loading versions' )
  }
  
  return versions_res.data.versions
}


const all_versions = ref ( [] )
const all_versions_map = ref ( {} )
const all_versions_map_by_language = ref ( {} )
const versions_loaded = ref ( true )

async function load_all_versions () {
  versions_loaded.value = false
  const versions_res = await retrieve_all ()
    .catch(err => {
      const message = 'Error loading Bible versions'
      console.error(message, err)
      Errors.error_messages.value.push ({
        message,
        error: err
      })
    })
  all_versions.value.splice ( 0, 0, ...versions_res )
  all_versions_map.value = to_map ( versions_res )
  all_versions_map_by_language.value = to_map_by_language ( versions_res )
  versions_loaded.value = true
}

function to_map ( versions_list ) {
  return versions_list.reduce( ( obj, version ) => ({
    ...obj,
    [ version.id ]: version,
  }), {} )
}


function to_map_by_language ( versions_list ) {
  return versions_list.reduce( ( obj, version ) => ({
    ...obj,
    [ version.language_id ]: 
      obj [ version.language_id ]
      ? [ ...obj [ version.language_id ], version ]
      : [ version ],
  }), {} )
}


export default {

  new: _new,
  retrieve_all,
  load_all_versions,

  all_versions,
  all_versions_map,
  all_versions_map_by_language,
  versions_loaded,

  to_map,
  to_map_by_language,

}