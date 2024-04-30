<!-- PassageActionButtons -->

<script setup>
  import { defineProps, toRefs } from 'vue'

  const default_buttons_base = [{
    type: 'submit',
    tooltip: 'Submit',
    icon: 'check',
  }, {
    type: 'add',
    tooltip: 'Search',
    // text: 'Go',
    icon: 'magnifying-glass',
  }, {
    type: 'edit',
    tooltip: 'Edit',
    icon: 'pen',
  }, {
    type: 'cancel',
    tooltip: 'Close',
    icon: 'xmark',
  }, {
    type: 'remove',
    tooltip: 'Delete',
    icon: 'trash',
  }]
  
  const props = defineProps ({
    buttons: Object,
  })
  
  const {
    buttons
  } = toRefs ( props )

</script>

<template>
  <div
    class="passage_actions_buttons_wrapper ml-4 d-flex flex-nowrap"
    data-screen_media_only
    >
    
    <template
      v-for="button_base in default_buttons_base" :key="button_base.type"
      >
      <VTooltip
        v-if="buttons[ button_base.type ]"
        :text="button_base.tooltip"
        location="top"
        >
        <template #activator="{ props }">
          <CircleBtn
            v-bind="props"
            :density="buttons[ button_base.type ].size === 'xl' ? 'default' : 'compact'"
            :size="buttons[ button_base.type ].size === 'xl' ? 'x-large' : 'default'"
            rounded="xl"
            class="passage_action_button"
            :class="[
              `passage_action_button--${ button_base.type }`,
            ]"
            :icon="`fas fa-${ button_base.icon }`"
            @click="buttons[ button_base.type ].click
              ? buttons[ button_base.type ].click( $event )
              : buttons[ button_base.type ]( $event )"
            />
            <!-- {{ button_base.text }} -->
        </template>
      </VTooltip>
    </template>
    <!-- <template v-if="button_base.text">
      {{ button_base.text }}
    </template> -->

  </div>
</template>