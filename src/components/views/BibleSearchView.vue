<script setup>
  import SidePanel from '@/components/containers/SidePanel.vue'
  import ResultsToolbar from '@/components/containers/ResultsToolbar.vue'
  import ResultsPanel from '@/components/containers/ResultsPanel.vue'
  import ResultsFooter from '@/components/containers/ResultsFooter.vue'
  import LoaderPassages from '@/components/blocks/loaders/LoaderPassages.vue'
  import AlertModalError from '@/components/utils/AlertModalError.vue'

  import Language from '@/composables/language.composable'
  import Passage from '@/composables/passage.composable'
  import Version from '@/composables/version.composable'
  import Errors from '@/composables/utils/errors.composable'
  import Layout from '@/composables/layout.composable'
  import { useDisplay } from 'vuetify'

  const { xs, sm } = useDisplay()

  Promise.all ([
    Language.load_all_languages(),
    Version.load_all_versions()
  ]).then ( () => {
    Language.init_default_language()
  })

  const expanded_side_panel = Layout.expanded_side_panel
  const side_panel_is_open = Layout.side_panel_is_open

  function open_close_side_panel() {
    expanded_side_panel.value = !expanded_side_panel.value
    if ( xs.value ) {
      if ( Layout.side_panel_is_open.value )
        Layout.close_side_panel()
      else
        Layout.open_side_panel()
    }
  }
</script>

<template>
  <VLayout
    id="mbs_main_container"
    class="print_media bg-surface-lighten-2"
    >
    <SidePanel
      id="mbs_side_panel"
      />

    <VMain id="mbs_results_containter">
      <ResultsToolbar
        id="mbs_toolbar"
        />
      <ResultsPanel id="mbs_results_panel" />
      <ResultsFooter />
    </VMain>


    <VTooltip
      v-if="!sm"
      :text="expanded_side_panel ? 'Collapse side panel' : 'Expand side panel'"
      >
      <template #activator="{ props }">
        <VBtn
          v-bind="props"
          variant="elevated"
          size="medium"
          class="side_panel_show_hide_button pa-3 d-flex align-center justify-center"
          :class="{
            collapsed: ( !xs && !expanded_side_panel ) || ( xs && !side_panel_is_open ),
            horizontal: xs,
          }"
          data-screen_media_only
          icon="fas fa-chevron-left"
          :elevation="1"
          @click="open_close_side_panel"
          />
      </template>
    </VTooltip>


    <LoaderPassages
      v-if="!Passage.passages_loaded.value"
      id="mbs_loader"
      />

    <AlertModalError v-if="Errors.error_messages.value.length" />

  </VLayout>
</template>

<style lang="sass">
// .v-tooltip > .v-overlay__content
//   background: magenta !important

#mbs
  // &_footer

  &_main_container
    display: flex
    padding: .5rem
    min-width: 100vw
    max-width: 100vw
    line-height: 1
    // overflow: hidden

    // div, span, applet, object, iframe, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, font, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend
    font-size: .8rem

    .pulse_animation
      animation: 1.5s infinite alternate pulse

    [data-print_media_only]
        display: none

    h1
      font-size: 1.5rem
    h2
      font-size: 1.25rem
      margin: 0
      padding: 0
    h3
      font-size: 1rem
      margin: 0
      padding: 0
    h4
      font-size: 1rem
      margin: 0
      padding: 0
    h5
      font-size: 1rem
      margin: 0
      padding: 0
    h6
      font-size: 1rem
      margin: 0
      padding: 0
    
    .script
      &_ur
        font-family: 'Jameel Noori Nastaleeq'
        font-size: .9rem
      &_ar
        font-size: 1rem

    .side_panel_show_hide_button
      position: fixed
      top: 5rem
      left: 14.5rem
      z-index: 99999
      transition: .3s ease all

      svg
        transition: .3s ease all

      &.collapsed
        left: 1.25rem
        i
          transition: .3s ease all
          transform: rotate( 180deg )

      &.horizontal
        right: calc( 50vw - 2rem )
        top: calc( 100vh - 3.5rem )
        transform: rotate( 90deg )

        &.collapsed
          left: calc( 50vw - 2rem )
          top: 0rem
          transform: rotate( 90deg )

  &_results_containter
    flex-grow: 1

  &_results_panel
    padding: 1rem

  &_loader
    position: fixed
    top: 0
    right: 0
    min-height: 100vh
    width: 100vw
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    background: transparentize(cornflowerblue, .25)
    z-index: 9

    .loader
      &_icon
        font-size: 3rem
        margin-bottom: 1rem
        margin-top: -3rem
      &_label
        font-size: 1.25rem

  
  @media print

    &
      &_side_panel
        display: none
      &_toolbar
        display: none
      &_results_panel
        padding: 0
        margin: 0
        z-index: 0

      &_results_containter
        padding: 0
        margin: 0

      &_footer
        position: fixed
        bottom: 0
        z-index: -1

        .text-caption
          font-size: 1.5rem !important

      &_main_container.print_media
        font-size: 2rem
        // left: 1.75rem // fix left margin issue on print modal
        position: relative
        padding: 0
        margin: 0
        // margin-left: -1rem
        max-width: 100vw
        width: calc( 100% - 1rem ) // fix right margin issue on print modal
        
        [data-print_media_only]
          display: block

        [data-screen_media_only]
          display: none !important

        h1
          font-size: 3rem
        h2
          font-size: 2.5rem
        h3
          font-size: 2.25rem
        h4
          font-size: 2rem
          &.passage_cite_full
            font-size: 12pt
        h5
          font-size: 1.75rem
        h6
          font-size: 1.5rem

        .script
          &_ur,
          &_ar
            font-size: 2rem

        VBtn
          display: none

        .results_panel
          margin: 0
          padding: 0

        .passage_copyrights
          font-size: 8pt !important
          .v-list-item
            padding: 0
            &--density-compact.v-list-item--one-line
              min-height: fit-content


        .passage_group
          border: none
          box-shadow: none
          margin: 0
          padding: 0
          background: white
          // border: thin solid blue
          // margin-bottom: 3rem

          &:hover
            box-shadow: none

          &:hover
            background: white

        .passage_group_item
          padding-left: 0
          padding-right: 0

          &:hover
            background: white
            border: none

          &::before
            display: none
              
          .passage_group_item_detail
            padding-left: 0
            padding-right: 0

            &:hover
              background: white
              border: none

            &::before
              display: none

@media print
  html,
  body,
  #bible-search-app
    margin: 0
    padding: 0
    max-width: 100vw

  .v-tooltip > .v-overlay__content
    display: none !important
    color: transparent !important
    background: transparent !important

@keyframes pulse
  from
    opacity: 1
  to
    opacity: 0

</style>