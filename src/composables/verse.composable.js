import { ref } from "vue"

// Verse composable
export default {

  new (
    new_number,
    new_number_native,
    new_text,
  ) {

    const number = ref( new_number )
    const number_native = ref( new_number_native )
    const text = ref( new_text )
    
    return {
      number,
      number_native,
      book,
      text,
    }
  }

}