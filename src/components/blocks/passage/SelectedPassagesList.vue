<!-- SelectedPassagesList -->

<script setup>
  import CiteListItem from '@/components/blocks/passage/CiteListItem.vue'
  import CiteSelectNew from '@/components/blocks/passage/CiteSelectNew.vue'
  import SelectedList from '@/components/blocks/display/SelectedList.vue'

  import Cite from '@/composables/cite.composable'
  import { defineProps, toRefs } from 'vue'

  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false,
    },
  })

  const {
    collapsed,
  } = toRefs( props )
</script>

<template>
  <SelectedList
    title="Passages"
    :selected_list="Cite.selected_cites.value"
    :class="{
      collapsed,
    }"
    >
    <template #list_item="data">
      <CiteListItem
        :item_key="data.item.key"
        :hide_buttons="collapsed"
        />
    </template>
  </SelectedList>

  <CiteSelectNew
    :collapsed="collapsed"
    />
</template>