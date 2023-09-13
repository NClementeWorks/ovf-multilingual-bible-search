<!-- SettingsExpansionPanels -->
<script setup>
  import { defineProps, toRefs } from 'vue'

  const props = defineProps({
    mandatory: {
      type: Boolean,
      default: false,
    },
    panels: {
      type: Array,
      default: [],
    },
  })

  const {
    mandatory,
    panels,
  } = toRefs( props )

</script>

<template>
  
  <VExpansionPanels
    class="settings_expansion_panel"
    variant="accordion"
    :mandatory="mandatory"
    >
    <VExpansionPanel
      v-for="( panel, index ) in panels" :key="panel"
      bgColor="surface-lighten-1"
      elevation="0"
      >
      <VExpansionPanelTitle
        class="pa-0"
        color="surface-lighten-1"
        >
          <span class="d-flex flex-column">
            {{ panel.title }}
            <!-- <small class="text_caption">{{ panel.tooltip }}</small> -->
          </span>
          <!-- <VTooltip
            v-if="panel.tooltip"
            activator="parent"
            location="top"
            :text="panel.tooltip"
            /> -->

        <template v-slot:actions="{ expanded }">
          
          <VTooltip
            :text="`${ expanded ? 'Close' : 'Open' } ${ panel.title } Panel`"
            location="top"
            >
            <template #activator="{ props }">
              <VIcon
                v-bind="props"
                :color="expanded ? 'surface-darken-2' : 'blue_deep'"
                :icon="expanded ? 'fas fa-minus' : 'fas fa-plus'"
                size="x-small"
                ></VIcon>
            </template>
          </VTooltip>
        </template>
      </VExpansionPanelTitle>
      <VExpansionPanelText>

        <slot :name="`panel_${ index + 1 }`" :panel_number="index + 1"></slot>
        
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>

</template>

<style lang="sass">
#mbs_main_container
  .settings_expansion_panel
    .v-expansion-panel
      &--active > .v-expansion-panel-title
        min-height: 2rem

      &-title
        min-height: 2rem

        &__overlay
          background: transparent

        // &:hover
        //   border-bottom: 1px solid black

      &-text__wrapper
        padding: 0 0 0 .5rem
        border-left: 1px solid rgb( var( --v-theme-surface ) )
</style>