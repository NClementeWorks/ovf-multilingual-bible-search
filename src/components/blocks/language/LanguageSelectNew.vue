<!-- LanguageSelectNew -->

<script setup>
  import LanguageSelectInput from '@/components/blocks/language/LanguageSelectInput.vue'
  import PassageActionButtons from '@/components/blocks/buttons/PassageActionButtons.vue'

  import Language from '@/composables/language.composable'
  import { ref, defineProps, toRefs } from 'vue'

  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false,
    },
  })

  const {
    collapsed,
  } = toRefs( props )

  const show_select = ref ( false )

  const add_language_to_selected = () => {
    Language.add_selected_language ( Language.new_langauge_to_add.value )
    show_select.value = false
  }

</script>

<template>
  <div
    v-if="show_select"
    class="select_new language_select_new"
    data-screen_media_only
    >

    <LanguageSelectInput />

    <div class="select_new_buttons">
      <PassageActionButtons
        :buttons="{
          add: add_language_to_selected,
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
      icon="fas fa-globe"
      @click="show_select = true"
      />
    <AddNewBtn
      v-else
      class="add_new_button"
      prepend-icon="fas fa-globe"
      @click="show_select = true"
      >
      Add Language
    </AddNewBtn>

  </div>

</template>