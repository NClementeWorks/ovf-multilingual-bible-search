<!-- LanguageListItem -->

<script setup>
  import LanguageLabel from '@/components/blocks/language/LanguageLabel.vue'
  import LanguageSelectInput from '@/components/blocks/language/LanguageSelectInput.vue'
  import PassageActionButtons from '@/components/blocks/buttons/PassageActionButtons.vue'

  import Passage from '@/composables/passage.composable'
  import Language from '@/composables/language.composable'
  import { clone_deep } from '@/composables/utils/utils.composable'
  import { defineProps, ref, toRefs } from 'vue'

  const props = defineProps ({
    item_key: [ String, Number ],
    hide_buttons: {
      type: Boolean,
      default: false,
    },
    font_size: {
      type: String,
      default: '1rem'
    },
  })
  
  const {
    item_key,
    hide_buttons,
    font_size,
  } = toRefs ( props )

  const show_select = ref ( false )
  let old_value = null

  const select_buttons = {
    submit: () => {
      Passage.update_passages_for_version ( Language.selected_languages_map.value [ item_key.value ] )
      show_select.value = false
    },
    cancel: () => {
      // return to old value
      Language.selected_languages_map.value [ item_key.value ].content = old_value.content
      show_select.value = false
    },
  }
  const label_buttons = {
    edit: () => {
      // copy old value
      old_value = clone_deep ( Language.selected_languages_map.value [ item_key.value ] )
      show_select.value = true
    },
    remove: () => Language.remove_selected_language ( Language.selected_languages_map.value [ item_key.value ] )
  }

</script>

<template>
  <div class="list_item langauge_list_item">
    
    <LanguageSelectInput
      v-if="show_select"
      :item_key="item_key"
      />
      
    <LanguageLabel
      v-else
      :item_key="item_key"
      :font_size="font_size"
      />
    
    <PassageActionButtons
      v-if="!hide_buttons"
      class="list_item_buttons"
      :buttons="show_select ? select_buttons : label_buttons"
      />

  </div>
</template>

<style lang="sass">
.list_item
  display: flex
  align-items: baseline
  padding: .25rem 0

  .side_panel &
    flex-direction: column
    border: 1px solid transparent

    .list_item_buttons
      display: none

  &.langauge_list_item
    align-items: center
    
    .side_panel &
      align-items: flex-start
</style>