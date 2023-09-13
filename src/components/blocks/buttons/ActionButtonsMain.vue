<script setup>
  import TextFile from '@/composables/text_file.composable'
  
  const call_print = () => window.print()
  const generate_text_file = () => TextFile.generate_text_file ()
  const generate_doc_file = () => TextFile.generate_doc_file ()
</script>

<template>
  <MainActionBtn
    class="print_button main_action_button"
    prepend-icon="fas fa-print"
    @click="call_print"
    >
    Print
    <VTooltip
      text="Open Print menu"
      location="bottom"
      activator="parent"
      />
  </MainActionBtn>

  <MainActionBtn
    class="text_file_button main_action_button"
    prepend-icon="fas fa-file-arrow-down"
    @click="generate_doc_file"
    >
    Word Doc
    <VTooltip
      text="Download a Word Document file"
      location="bottom"
      activator="parent"
      />
  </MainActionBtn>

  <MainActionBtn
    class="text_file_button main_action_button"
    prepend-icon="fas fa-file-arrow-down"
    @click="generate_text_file"
    >
    Plain Text
    <VTooltip
      text="Download a plain text file"
      location="bottom"
      activator="parent"
      />
  </MainActionBtn>
</template>