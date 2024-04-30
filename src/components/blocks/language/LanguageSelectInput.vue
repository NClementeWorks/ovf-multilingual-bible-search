<!-- LanguageSelectInput -->

<script setup>
  import Language from '@/composables/language.composable'
  import Version from '@/composables/version.composable'
  import { computed, defineProps, ref, toRefs } from 'vue'

  const language_select_el = ref( null )

  const props = defineProps ({
    item_key: [ String, Number ],
  })
  const { item_key } = toRefs ( props )

  const update_default_version = ( value ) => {
    if ( !value || typeof value === 'string' )
      return

    selected.value.content = value
    selected.value.content.version = Language.get_default_language_version( selected.value.content.id )
  }
  
  const selected = item_key?.value
    ? ref ( Language.selected_languages_map.value [ item_key.value ] )
    : Language.new_langauge_to_add
  
  const language_name = computed( () => selected.value?.content?.name )

  const set_caret = () => {
    console.log('language_select_el:', language_select_el) 
  }

</script>

<template>
  <VCard
    v-if="selected?.content"
    class="language_select pa-4 d-flex flex-row"
    color="transparent"
    elevation="0"
    >

    <VCombobox
      ref="language_select_el"
      class="language_select_box"
      v-model="language_name"
      :items="Language.get_languages_filtered()"
      item-title="name"
      return-object
      clearable
      open-on-clear
      @update:model-value="update_default_version"
      @focus="set_caret"
      />
      <!-- item-value="id" -->
      <!-- :placeholder="selected.content.name"
      track-by="name"
      :allow-empty="false"
      :showLabels="false" -->
    
    <template v-if="Version.all_versions_map_by_language.value [ selected.content.id ]?.length === 1">
      <span class="language_select_versions_single">
        ({{ Version.all_versions_map_by_language.value [ selected.content.id ] [ 0 ].code }})
        <VTooltip
          :text="Version.all_versions_map_by_language.value [ selected.content.id ] [ 0 ].name"
          location="top"
          activator="parent"
          />
      </span>
    </template>

    <div
      v-else
      class="language_select_versions">
      <div
        class="language_select_versions_item"
        v-for="version in Version.all_versions_map_by_language.value [ selected.content.id ]" :key="version.id">

        <input
          type="radio"
          :name="`new_version`"
          :id="`lang_version_${version.id}`"
          :value="version.id"
          v-model="selected.content.version"
          />

        <label
          class="version_label"
          :for="`lang_version_${version.id}`"
          >
          {{ version.code }}
        <VTooltip
          :text="version.name"
          location="top"
          activator="parent"
          />
        </label>

      </div>
    </div>

  </VCard>
</template>

<style lang="sass">
.language_select
  display: flex
  align-items: center
  padding: 0.5rem
  color: #000
  border-radius: 0.25rem

  &_versions
    padding: 0 .5rem

    &_single
      padding: 0 .25rem 0 .5rem
      display: flex
      height: 1.5rem
      align-items: center
      font-size: .75rem

    &_item
      font-size: .75rem
      font-weight: normal
      display: flex
      align-items: center
      padding: .25rem

      input[type="radio"]
        margin: 0
        margin: 0 .5rem

      label
        line-height: 1

  &_box
    min-width: 8rem
</style>