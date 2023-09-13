import XHR from '@/composables/utils/xhr.composable'
import Version from '@/composables/version.composable'
import Passage from '@/composables/passage.composable'
import Errors from '@/composables/utils/errors.composable'
import { clone_deep } from '@/composables/utils/utils.composable'
import { computed, ref } from "vue"

// Language composable

const _new = ( new_code, new_name, new_versions ) => {

  const code = ref ( new_code )
  const name = ref ( new_name )

  const versions = new_versions

  return {
    code,
    name,
    versions,
  }
}


async function retrieve_all () {
  const xhr = XHR.new ()
  const languages_res = await xhr.get ( 'languages' )
  
  return languages_res?.data?.languages
}


const all_languages = ref ( [] )
const all_languages_map = ref ( {} )
const new_langauge_to_add = ref ( {} )
const selected_languages = ref ( [] )
const selected_languages_map = ref ( {} )
let selected_languages_last_key = 0
const languages_loaded = ref ( true )

async function load_all_languages () {
  languages_loaded.value = false
  const languages_res = await retrieve_all ()
    .catch(err => {
      const message = 'Error loading Languages'
      console.error(message, err)
      Errors.error_messages.value.push ({
        message,
        error: err
      })
    })
  all_languages.value.splice ( 0, 0, ...languages_res )
  all_languages_map.value = to_map ( languages_res )
  languages_loaded.value = true
}

function init_default_language () {
  if ( languages_loaded.value
    && Version.versions_loaded.value ) {
    
    const default_language = get_languages_filtered ()[ 0 ]
    const default_version_id = get_default_language_version ( default_language.id )

    new_langauge_to_add.value = {
      content: {
        ...default_language,
        version: default_version_id
      }
    }
  }

}

function get_default_language_version ( language_id ) {
  const versions = Version.all_versions_map_by_language.value [ language_id ]
  return versions?.length
    ? versions[0].id
    : null
}

function get_languages_filtered () {
  return all_languages.value
    .filter( lang => Version.all_versions_map_by_language.value[ lang.id ] )
}

function update_selected_languages_map () {
  selected_languages_map.value = selected_languages.value.reduce ( ( obj, lang ) => ({
    ...obj,
    [ lang.key ]: lang,
  }), {})
}

function add_selected_language ( new_value ) {
  new_value.key = selected_languages_last_key++

  selected_languages.value.push ( clone_deep( new_value ) )
  update_selected_languages_map ()

  Passage.get_passages_for_version ( new_value )
}

function remove_selected_language ( item ) {
  const value_index = selected_languages.value
    .findIndex ( val => val.key === item.key )

  selected_languages.value.splice (
    value_index,
    1
  )

  Passage.remove_passages_for_version( item )
  update_selected_languages_map ()
}


function to_map ( languages_list ) {
  return languages_list.reduce( ( obj, language ) => ({
    ...obj,
    [ language.id ]: language,
  }), {} )
}


const active_copyrights = computed( () => {
  return selected_languages.value
    .filter( lang => Version.all_versions_map.value [ lang.content?.version ]?.copyrights?.notice )
    .map( ( lang, index ) => ({
        index,
        key: lang.content.version,
        notice: Version.all_versions_map.value [ lang.content.version ].copyrights.notice
      })
    )
})


const current_scripts = computed( () => {
  const current_scripts_obj = selected_languages.value
    .map( lang => lang.content.script )
    .reduce( ( result, script ) => ({
      ...result,
      [ script.id ]: script
    }), {})
  return Object.values( current_scripts_obj )
})

const all_scripts_languages = computed( () => {
  return all_languages.value
    .reduce( ( obj, language ) => ({
      ...obj,
      [ language.script.code ]: 
        obj [ language.script.code ]
        ? [
          ...obj [ language.script.code ],
          language,
        ]
        : [ language ]
    }), {})
})


export default {

  new: _new,
  retrieve_all,
  
  all_languages,
  all_languages_map,
  new_langauge_to_add,
  selected_languages,
  selected_languages_map,
  languages_loaded,

  load_all_languages,
  init_default_language,
  get_default_language_version,
  get_languages_filtered,
  add_selected_language,
  remove_selected_language,

  to_map,
  active_copyrights,
  current_scripts,
  all_scripts_languages,

}