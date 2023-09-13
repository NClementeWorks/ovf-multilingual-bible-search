import { ref } from "vue"

// Chapter composable
export default {

  new (
    new_number,
    new_number_native,
    new_verses,
  ) {

    const number = ref( new_number )
    const number_native = ref( new_number_native )
    const verses = ref( new_verses )
    
    return {
      number,
      number_native,
      book,
      verses,
    }
  }

}