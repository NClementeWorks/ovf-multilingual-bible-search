<script setup>
  import CiteSelector from '@/components/blocks/passage/CiteSelector.vue'
  import PassageActionButtons from '@/components/blocks/buttons/PassageActionButtons.vue'

  import Cite from '@/composables/cite.composable'
  import { ref, toRefs, defineProps } from 'vue'

  const props = defineProps({
    collapsed: {
      type: Boolean,
      defalt: false,
    }
  })

  const {
    collapsed,
  } = toRefs( props )
  
  const show_select = ref ( false )

  const add_passage_to_selected = () => {
    Cite.add_selected_cite ( Cite.new_cite_to_add.value )
    show_select.value = false
  }

</script>

<template>
  <div
    v-if="show_select"
    class="select_new cite_select_new"
    data-screen_media_only
    >

    <CiteSelector
      :embeded="true"
      />
    
    <div
      v-if="!collapsed"
      class="select_new_buttons"
      >
      <PassageActionButtons
        :buttons="{
          add: add_passage_to_selected,
          cancel: () => show_select = false
        }"
        />
    </div>
  </div>

  <div
    v-else
    class="select_new"
    data-screen_media_only
    >
    
    <AddNewBtn
      v-if="collapsed"
      class="add_new_button"
      size="small"
      icon="fas fa-book-open"
      @click="show_select = true"
      />
    <AddNewBtn
      v-else
      class="add_new_button"
      prepend-icon="fas fa-book-open"
      @click="show_select = true"
      >
      Add Passage
    </AddNewBtn>

  </div>

</template>

<style lang="sass">
#mbs_main_container

  .select_new
    display: flex
    align-items: center
    flex-direction: row

    .add_new_button
      background: rgb( var( --v-theme-primary ) )
      color: white

      &:hover
        background: deeppink

  .new_cite_label
    margin-left: 1rem
</style>