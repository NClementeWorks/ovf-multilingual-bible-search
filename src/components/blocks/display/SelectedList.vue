<!-- SelectedList -->

<script setup>
  import { defineProps, toRefs } from 'vue'

  const props = defineProps ({
    title: String,
    selected_list: Array,
  })
  
  const {
    title,
    selected_list
  } = toRefs ( props )

</script>

<template>
  <VList
    class="selected_list"
    density="compact"
    >
    <VListSubheader>
      {{ title }}
    </VListSubheader>
    <VListItem v-for="item in selected_list" :key="item.key"
    >
      <slot
        name="list_item"
        :item="item"
        >
      </slot>
    </VListItem>
  </VList>
</template>

<style lang="sass">
ul.selected_list
  padding: 1rem 0
  list-style-type: none
  margin: 0
    
  li
    padding: .5rem 0
    text-wrap: nowrap
    
    &:first-child
      padding-top: 0
    &:last-child
      padding-bottom: 0

</style>