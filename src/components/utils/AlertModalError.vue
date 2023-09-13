<!-- AlertModalError -->
<script setup>
  import AlertModal from '@/components/utils/AlertModal.vue'
  import Errors from '@/composables/utils/errors.composable'
</script>

<template>
  <AlertModal
    title="Error"
    color="red"
    :closable="false"
    class="alert_modal_error"
    @close="Errors.error_messages.value = []"
    >
    <ul>
      <li v-for="( error, idx ) in Errors.error_messages.value" :key="idx">
        {{ error.message }}
      </li>
    </ul>
    <template #footer>
      Please, try one of the following:
      <ul class="error_options">
        <li>Try your search again</li>
        <li>Reload your browser</li>
        <li>Contact your adminnistrator if the error persists</li>
      </ul>
    </template>
  </AlertModal>
</template>

<style lang="sass">
.alert_modal
  &_error
    .alert_modal
      //   border-color: red

      ul
        padding-left: 1rem

    // &_heading
    //   margin: .5rem 0 2rem
    //   display: flex
    //   align-items: center
    //   justify-content: center

// .error_icon_exclamation
//   border: 2px solid
//   width: 1.5rem
//   height: 1.5rem
//   border-radius: 100%
//   padding: .25rem
//   margin-right: .5rem

.error_options

  li
    padding: .25rem 0

    &:last-child
      padding-bottom: 0
</style>