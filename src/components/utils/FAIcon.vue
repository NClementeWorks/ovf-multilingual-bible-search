
<script setup>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  import { defineProps, toRefs } from 'vue'

  const props = defineProps ({
    icon: String,
  })
  
  const {
    icon
  } = toRefs ( props )

</script>

<template>
  <FontAwesomeIcon :icon="['fas', icon]" />
</template>