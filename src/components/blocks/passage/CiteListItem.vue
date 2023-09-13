<!-- CiteListItem -->

<script setup>
  import CiteLabel from '@/components/blocks/passage/CiteLabel.vue'
  import CiteSelector from '@/components/blocks/passage/CiteSelector.vue'
  import PassageActionButtons from '@/components/blocks/buttons/PassageActionButtons.vue'

  import Passage from '@/composables/passage.composable'
  import Cite from '@/composables/cite.composable'
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
      Passage.update_passages_for_cite ( Cite.selected_cites_map.value [ item_key.value ] )
      show_select.value = false
    },
    cancel: () => {
      // return to old value
      Cite.selected_cites_map.value [ item_key.value ].content = old_value.content
      show_select.value = false
    },
  }

  const label_buttons = {
    edit: () => {
      // copy old value
      old_value = clone_deep ( Cite.selected_cites_map.value [ item_key.value ] )
      show_select.value = true
    },
    remove: () => Cite.remove_selected_cite ( Cite.selected_cites_map.value [ item_key.value ] )
  }

  const is_cite_selector_closed = ref ( true )
</script>

<template>
  <div class="list_item"
    :class="{
      list_item_cite_selector_closed: is_cite_selector_closed && show_select
    }">

    <CiteSelector
      v-if="show_select"
      :item_key="item_key"
      @open_status_changed="is_cite_selector_closed = $event === 'closed'"
      />

    <CiteLabel
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
.list_item.list_item_cite_selector_closed
  align-items: center
</style>