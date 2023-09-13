<!-- ResultsToolbar -->

<script setup>
  import ActionButtonsMain from '@/components/blocks/buttons/ActionButtonsMain.vue'

  import PassageGrouping from '@/composables/passage_grouping.composable'
  import { ref } from 'vue'
  import { useDisplay } from 'vuetify'

  const { width, thresholds } = useDisplay()

  function switch_by_grouping() {
    PassageGrouping [ `group_passages_by_${ PassageGrouping.grouping_option.value }` ] ()
  }

  function switch_by_verse() {
    PassageGrouping.by_verse.value = !PassageGrouping.by_verse.value;
    PassageGrouping [ `group_passages_by_${ PassageGrouping.grouping_option.value }` ] ()
  }

  const is_main_actions_menu_open = ref ( false )
  const grouping_option = PassageGrouping.grouping_option
  const by_verse = PassageGrouping.by_verse
</script>

<template>
  <VAppBar
    class="results_toolbar bg-surface-lighten-2 px-2"
    :elevation="1"
    density="compact"
    data-screen_media_only
    >

    <h6 class="group_by_label">
      Group by:
    </h6>

    <VBtnToggle
      v-model="grouping_option"
      rounded="xl"
      color="purple"
      density="compact"
      mandatory
      @update:modelValue="switch_by_grouping"
      >
      <VBtn
        value="language"
        >
        Language
        <VTooltip
          text="Group by Language"
          location="bottom"
          activator="parent"
          />
      </VBtn>
      <VBtn
        value="passage"
        >
        Passage
        <VTooltip
          text="Group by Passage"
          location="bottom"
          activator="parent"
          />
      </VBtn>
    </VBtnToggle>

    <VSwitch
      class="input_checkbox"
      name="by_verse"
      id="by_verse"
      color="purple"
      v-model="by_verse"
      @click="switch_by_verse"
      >
      <template #label>
        Individual Verses
        <VTooltip
          text="Distribute Verse by Verse"
          location="bottom"
          activator="parent"
          />
      </template>
    </VSwitch>
    
    <VSpacer></VSpacer>
    
    <div>
      <template v-if="width < thresholds.toolbar_main_actions_menu_break_point">
        <VBtn
          id="main_actions_menu_activator"
          variant="outlined"
          color="secondary"
          class="main_actions_menu"
          :class="{
            open: is_main_actions_menu_open,
          }"
          @click="is_main_actions_menu_open = !is_main_actions_menu_open"
          >
          Export
        </VBtn>
        <VMenu
          activator="#main_actions_menu_activator">
          <ActionButtonsMain />
        </VMenu>
      </template>
      <template v-else>
        <div class="main_action_buttons_wrapper">
          <ActionButtonsMain />
        </div>
      </template>
    </div>

  </VAppBar>
</template>

<style lang="sass">
#mbs_main_container

  .results_toolbar

    .main_actions
      
      .main_action_button
        width: 100%

        &s_wrapper
          display: flex
          flex-wrap: nowrap

          .main_action_button
            display: flex
            flex-wrap: nowrap
            
            span
              white-space: nowrap
                    
          .main_action_button
            margin-left: 0
            padding: .75rem 1rem
            border-bottom: 1px solid #fff8
            border-radius: 0
            
      &_menu
        cursor: pointer
        display: flex
        align-items: center
        justify-content: center
        height: 2rem
        padding: .25rem 1rem
        background: rgb( var( --v-theme-white ) )
        border: 1px solid rgb( var( --v-theme-secondary ) )
        border-radius: .25rem

        &.open
          border-bottom-right-radius: 0

  .group_by

    &_panel
      display: flex
      align-items: baseline

    &_label
      margin: auto .5rem auto 0

      @media ( max-width: 40rem )
        display: none


  .group_button
    margin-top: auto
    margin-bottom: auto

  .main_action_button
    margin-left: .5rem

    &:hover
      background: deeppink

  .input_checkbox
    display: inline-flex
    margin: auto 1rem

  input[type="checkbox"]
    margin: 0
    margin-right: .5rem

.v-menu
  .main_action_button
    &:hover
      background: deeppink !important
</style>