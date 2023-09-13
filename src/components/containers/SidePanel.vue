<script setup>
  import SelectedLangaugesList from '@/components/blocks/language/SelectedLangaugesList.vue'
  import SelectedPassagesList from '@/components/blocks/passage/SelectedPassagesList.vue'
  import LoaderLanguages from '@/components/blocks/loaders/LoaderLanguages.vue'
  import DisplaySettings from '@/components/blocks/display/DisplaySettings.vue'

  import Layout from '@/composables/layout.composable'
  import Language from '@/composables/language.composable'
  import Version from '@/composables/version.composable'
  import { onMounted, ref, watch } from 'vue'
  import { useDisplay } from 'vuetify'

  const display = useDisplay()

  const expanded_side_panel = Layout.expanded_side_panel
  const side_panel_horizontal_height = Layout.side_panel_horizontal_height

  watch( display.smAndDown, (new_value) => {
    expanded_side_panel.value = !new_value
  })

  watch( display.xs, (new_value) => {
    if ( new_value )
      Layout.close_side_panel()
    else
      Layout.open_side_panel()
  })

  const hover_expanded_side_panel = ref( false )
  function rail_changed( rail ) {
    if ( display.smAndDown.value )
      hover_expanded_side_panel.value = !rail
  }

  onMounted( () => {
    expanded_side_panel.value = !display.sm.value
  })

</script>

<template>
  <VNavigationDrawer
    :rail="!expanded_side_panel || display.smAndDown.value"
    rail-width="45"
    :expand-on-hover="display.sm.value"
    floating
    permanent
    data-screen_media_only
    class="bg-surface-lighten-1 d-flex flex-wrap"
    :class="[
      !expanded_side_panel || display.smAndDown.value ? 'pa-1' : 'pa-4',
      {
        horizontal: display.xs.value,
        side_panel_closed: !expanded_side_panel && !display.smAndDown.value,
      },
    ]"
    :location="display.xs.value ? 'top' : 'left'"
    :style="{
      height: display.xs.value ? side_panel_horizontal_height : `100vh`,
    }"
    @update:rail="rail_changed"
    >

    <template #prepend>
      <VToolbarTitle
        id="app_heading"
        :class="[ display.xs.value ? 'mb-1' : 'mb-8' ]"
        >
        <div class="d-flex">
          <h1 v-if="expanded_side_panel">Multilingual Bible Search</h1>
          <h1 v-else>M<br/>B<br/>S</h1>
        </div>
      </VToolbarTitle>

      <!-- <pre>{{ Language.current_scripts.value }}</pre>
      <pre>{{ Language.all_scripts_languages }}</pre> -->
    </template>

    <div
      v-if="hover_expanded_side_panel || expanded_side_panel"
      class="side_panel_content d-flex justify-space-around"
      :class="{
        'flex-column': !display.xs.value,
      }"
      >
      <!-- Passage Cites List -->
      <div class="d-flex flex-column">
        <SelectedPassagesList
          :collapsed=" ! ( hover_expanded_side_panel || expanded_side_panel )"
          />
      </div>

      <VDivider
        v-if="!display.xs.value"
        class="my-4"
        ></VDivider>

      <!-- Languages List -->
      <div class="d-flex flex-column">
        <LoaderLanguages
          v-if="!Language.languages_loaded.value && !Version.versions_loaded.value"
          />
        <SelectedLangaugesList
          v-else
          :collapsed=" ! ( hover_expanded_side_panel || expanded_side_panel )"
          />
      </div>
          
      <VDivider
        v-if="!display.xs.value"
        class="my-4"
        ></VDivider>

      <div>
        <VListItemSubtitle
          class="mb-4"
          >Settings</VListItemSubtitle>

        <DisplaySettings />
      </div>

    </div>
  </VNavigationDrawer>
</template>

<style lang="sass">
#mbs
  &_side_panel
    max-width: 100vw
    flex-wrap: wrap
    flex-direction: inherit
    overflow: auto

    .v-navigation-drawer__content,
    .side_panel_content
      width: 100%
      height: fit-content
      min-height: 100%
      overflow: visible

    #app_heading
      font-size: 1rem
      font-weight: bolder
      // margin-bottom: 2rem
      
    .v-navigation-drawer__prepend
      width: 100%
      flex-grow: 1

      h1
        margin-top: 0
        line-height: 1

    .select_new
      align-items: flex-start
      flex-direction: column

      &_buttons
        margin-top: .5rem

      .add_new_button
        background: transparent
        color: black

        &:hover
          background: deeppink
          color: white

    &.side_panel_closed
      min-width: 3rem
      max-width: 3rem
      padding-left: .25rem

      h4,
      .cite_label,
      .language_label

        position: relative
        max-width: 100%
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap

        &:hover
          max-width: unset
          overflow: visible
          background: #f7fafe
          padding: .25rem .25rem .25rem 0
          margin: -.25rem 0
          border-radius: .25rem
          z-index: 1
          
    .side_panel_show_hide_button
      position: fixed
      top: 5rem
      right: -.5rem
      svg
        transition: .3s ease all

    .side_panel_horizontal_close_button
      position: absolute
      bottom: -1.75rem
      left: calc( 50% - 20px )

    &::-webkit-scrollbar
      height: .5rem
      width: .5rem
    &::-webkit-scrollbar-track
      background: transparent
      border-bottom-right-radius: .25rem
      &:hover
        background: rgba( var( --v-theme-surface-darken-1 ), .25 )
        height: .75rem
        width: .75rem
    &::-webkit-scrollbar-thumb
      background: rgb( var( --v-theme-surface ) )
      border-radius: .25rem
      &:hover
        background: rgb( var( --v-theme-surface-darken-1 ) )


</style>