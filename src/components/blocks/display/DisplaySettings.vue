<!-- DisplaySettings -->
<script setup>
import FontSizesPanel from '@/components/blocks/display/FontSizesPanel.vue';
import SettingsExpansionPanels from '@/components/blocks/display/SettingsExpansionPanels.vue'

import Language from '@/composables/language.composable'
import Layout from '@/composables/layout.composable'

import { computed, watch } from 'vue';

  watch ( 
    Language.current_scripts,
    () => {
      Language.current_scripts.value.forEach( script => {
        Layout.add_script_font_size( script.code )
      })
  })

  const script_panels = computed( () => Language.current_scripts.value
    .map( ( script, index ) => ({
      script,
      title: script.name,
      languages: get_script_panel_languages_string( script ),
      panel_name: `panel_${ index + 2 }`
    }) )
  )

  function get_script_panel_languages_string( script ) {
    return Language.all_scripts_languages.value [ script.code ]
      .map( language => language.name )
      .join(', ')
  }

  function update_script_font_sizes () {
    Object.values( Layout.passage_font_sizes.value.scripts )
      .forEach( script => {
        if ( !script.title.updated )
          script.title.points_value = Layout.passage_font_sizes.value.global.title.points_value
        if ( !script.content.updated )
          script.content.points_value = Layout.passage_font_sizes.value.global.content.points_value
      })
  }

  function reset_script ( script_code, script_obj ) {
    script_obj[ script_obj.value_type ].points_value = Layout.passage_font_sizes.value.global.title.points_value

    Layout.passage_font_sizes.value.scripts [ script_code ] = {
      ...Layout.passage_font_sizes.value.scripts [ script_code ],
      [ script_obj.value_type ]: script_obj[ script_obj.value_type ],
    }
  }
</script>

<template>

  <SettingsExpansionPanels
    :panels="[
      { title: 'Font Sizes' },
    ]"
    >

    <template #panel_1>

      <SettingsExpansionPanels
        title="Font Sizes"
        :panels="[
          { title: 'Global' },
          ...script_panels,
          // ...Language.current_scripts.value.map( script => script.name )
        ]"
        >

        <template #panel_1>
          <FontSizesPanel
            v-model="Layout.passage_font_sizes.value.global"
            :update_colors_on_change="false"
            languages="All languages"
            @update:modelValue="update_script_font_sizes"
            />
        </template>

        <template
          v-for="script_wrapper in script_panels" :key="script_wrapper.script.id"
          #[script_wrapper.panel_name]
          >
          <FontSizesPanel
            v-model="Layout.passage_font_sizes.value.scripts [ script_wrapper.script.code ]"
            :update_colors_on_change="true"
            :languages="script_wrapper.languages"
            @reset_values="reset_script ( script_wrapper.script.code, $event )"
          />
        </template>

      </SettingsExpansionPanels>

    </template>

  </SettingsExpansionPanels>

</template>