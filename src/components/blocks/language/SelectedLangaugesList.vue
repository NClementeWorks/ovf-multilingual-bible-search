<!-- SelectedLangaugesList -->

<script setup>
  import LanguageListItem from '@/components/blocks/language/LanguageListItem.vue'
  import LanguageSelectNew from '@/components/blocks/language/LanguageSelectNew.vue'
  import SelectedList from '@/components/blocks/display/SelectedList.vue'

  import Language from '@/composables/language.composable'
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
    title="Languages"
    :selected_list="Language.selected_languages.value"
    :class="{
      collapsed,
    }"
    >
    <template #list_item="data">
      <LanguageListItem
        :item_key="data.item.key"
        :hide_buttons="collapsed"
        />
      </template>
    </SelectedList>
    
  <LanguageSelectNew
    :collapsed="collapsed"
    />
</template>

<style lang="sass">
.collapsed .v-list-subheader
  padding: 0
  --indent-padding: 0
</style>