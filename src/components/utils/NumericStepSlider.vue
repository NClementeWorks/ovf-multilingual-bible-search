<!-- NumericStepSlider -->

<script setup>
  import { clone_deep } from '@/composables/utils/utils.composable'
  import { defineEmits, defineProps, ref, toRefs } from 'vue'

  const default_color = 'green_deep'

  const props = defineProps({
    modelValue: {
      type: [ Object, Number ],
      default: null
    },
    label: {
      type: String,
      default: null,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: default_color,
    },
  })

  const {
    modelValue,
    label,
    min,
    max,
    color,
  } = toRefs( props )

  const emit = defineEmits ([
    'update:modelValue',
    'reset_value',
  ])

  const original_value = clone_deep ( modelValue.value )
  
  function increment_one_step () {
    if ( modelValue.value < max.value )
      emit ( 'update:modelValue', modelValue.value + 1 )
  }

  function decrement_one_step () {
    if ( modelValue.value > min.value )
      emit ( 'update:modelValue', modelValue.value - 1 )
  }

  function reset () {
    console.log('RESET', original_value, modelValue.value)
    // emit ( 'update:modelValue', original_value )
    emit ( 'reset_value', original_value )
  }

  function update_model ( event ) {
    emit ( 'update:modelValue', event )
  }

  const thumb_size = ref( 12 )

</script>

<template>  
  <VLabel
    v-if="label?.length"
    class="mt-4 text-caption"
    >{{ label }}</VLabel>

  <div class="d-flex flex-column align-center w-100">
    <VSlider
      v-model="modelValue"
      class="text-caption w-100"
      :color="color || default_color"
      :prepend-icon="icon ? `fas fa-${ icon }` : null"
      density="compact"
      type="number"
      step="1"
      :thumb-size="thumb_size"
      :min="min"
      :max="max"
      @update:modelValue="update_model"
      @mouseenter="thumb_size = 16"
      @mouseleave="thumb_size = 12"
      >
      <template #append>
        <slot :value="modelValue"></slot>
      </template>
    </VSlider>
    
    <div>
      <VBtn
        @click="decrement_one_step"
        >-</VBtn>
      <VBtn
        @click="increment_one_step"
        >+</VBtn>
      <VTooltip
        text="Reset values"
        >
        <template #activator="{ props }">
          <CircleBtn
            v-bind="props"
            class="numeric_step_slider_reset_button"
            icon="fas fa-arrow-rotate-left"
            @click.stop="reset"
            >
          </CircleBtn>
        </template>
      </VTooltip>

    </div>
  </div>
</template>

<style lang="sass">
#mbs_main_container
  .numeric_step_slider_reset_button
    font-size: .5rem
</style>