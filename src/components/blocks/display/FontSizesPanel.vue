<!-- FontSizesPanel -->
<script setup>
  import NumericStepSlider from '@/components/utils/NumericStepSlider.vue'
  import Layout from '@/composables/layout.composable'

  import { defineProps, defineEmits, toRefs } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: {
        title: 40,
        content: 0,
      },
    },
    update_colors_on_change: {
      type: Boolean,
      default: true,
    },
    languages: {
      type: String,
      default: null
    },
  })

  const {
    modelValue,
    update_colors_on_change,
  } = toRefs( props )

  const emit = defineEmits ([
    'update:modelValue',
    'reset_values',
  ])

  function update_model( value_type, value ) {
    emit ( 'update:modelValue', {
      ...modelValue.value,
      [value_type]: {
        points_value: value,
        updated: true,
      }
    })
  }

  function reset_value ( value_type, value ) {
    modelValue.value [ value_type ].updated = false

    emit ( 'update:modelValue', {
      ...modelValue.value,
      [value_type]: {
        points_value: value,
        updated: false,
      }
    })

    emit ( 'reset_values', {
      value_type,
      [value_type]: {
        points_value: value,
        updated: false,
      }
    })
  }

  function get_slider_color ( value_type ) {
    return update_colors_on_change.value
      && modelValue.value [ value_type ].updated
      ? 'purple'
      : null
  }

</script>

<template>
  <div class="d-flex flex-column">
    <small
      v-if="languages"
      class="text_caption w-100"
      >{{ languages }}</small>

    <NumericStepSlider
      v-model="modelValue.title.points_value"
      label="Passage Title"
      icon="text-height"
      :min="Layout.min_font_size"
      :max="Layout.max_font_size"
      :color="get_slider_color ( 'title' )"
      v-slot="{ value }"
      @update:modelValue="update_model ( 'title', $event )"
      @reset_value="reset_value ( 'title', $event )"
      >
      {{ value }}pt
    </NumericStepSlider>
      
    <VSpacer
      class="mb-2"
      ></VSpacer>

    <NumericStepSlider
      v-model="modelValue.content.points_value"
      label="Passage Text"
      icon="font"
      :min="Layout.min_font_size"
      :max="Layout.max_font_size"
      :color="get_slider_color ( 'content' )"
      v-slot="{ value }"
      @update:modelValue="update_model ( 'content', $event )"
      @reset_value="reset_value ( 'content', $event )"
      >
      {{ value }}pt
    </NumericStepSlider>

  </div>
</template>