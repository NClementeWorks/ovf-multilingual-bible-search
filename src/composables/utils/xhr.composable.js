import { ref } from "vue"
import axios from "axios";

// XHR composable
export default {

    // get_base_home_url: () => 'http://127.0.0.1/edsa-OVF2',
  // get_base_home_url: () => 'https://onevoicefellowship.org/staging',
  get_base_home_url: () => 'https://onevoicefellowship.org',

  get_base_api_url: function () { return this.get_base_home_url() + '/wp-json/ovf/mbs/v1/' },

  new () {

    const loading = ref(0)

    const get = async ( url ) => {
      loading.value = 1
      const res = await axios.get ( 
        this.get_base_api_url()
        + url
      )
      if ( !res ) {
        loading.value = -1
        return
      }
      loading.value = 0
      return res
    }
    
    return {
      loading,
      get,
    }
  }

}