<script setup>
  import { defineEmits, defineProps, toRefs, useSlots } from 'vue'

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    closable: {
      type: Boolean,
      default: true,
    },
  })

  const {
    title,
    color,
  } = toRefs( props )

  const emit = defineEmits([
    'close',
  ])

  const slots = useSlots()

</script>

<template>
  <div class="alert_modal_wrapper">
    <VAlert
      variant="tonal"
      type="error"
      :color="color"
      prominent
      border="start"
      :title="title"
      :closable="closable"
      class="alert_modal"
      @click:close="emit( 'close' )"
      >
      <!-- <VBtn class="close_button"
        @click="emit ( 'close' )">
        <FAIcon icon="xmark" />
      </VBtn> -->

      <VCard
        variant="text"
        class="mt-2"
        >
        <slot></slot>
      </VCard>
      
      <VCard
        v-if="slots.footer"
        variant="outlined"
        class="alert_modal_footer mt-4 pa-2">
        <VCardTet>
          <slot name="footer"></slot>
        </VCardTet>
      </VCard>
    </VAlert>
  </div>
</template>

<style lang="sass">
#mbs_main_container
  .alert_modal
    // padding: 3rem
    // border: .25rem solid cornflowerblue
    // border-radius: 1rem
    // background: white
    // display: flex
    // flex-direction: column
    position: relative
    top: -10%
    max-width: 50%
    background: white

    &_wrapper
      display: flex
      align-items: center
      justify-content: center
      position: fixed
      top: 0
      right: 0
      height: 100vh
      width: 100vw
      z-index: 9999
      background: #fff8

    // .close_button
    //   background: white
    //   border: 1px solid transparent
    //   border-radius: 1rem
    //   max-height: 2rem
    //   min-height: 2rem
    //   max-width: 2rem
    //   min-width: 2rem
    //   display: flex
    //   align-items: center
    //   justify-content: center
    //   position: absolute
    //   top: .5rem
    //   right: .5rem

    //   &:hover
    //     border-color: #ccc

    &_footer
      font-size: .8em
      // background: #6495ED11
      // border: 1px solid #6495ED
      // border-radius: .25rem
      // padding: .5rem

</style>