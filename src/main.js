import { createApp } from 'vue'
import App from './App.vue'

/* import fontawesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faXmark,
  faPen,
  faCheck,
  faTrash,
  faPlus,
  faBookOpen,
  faGlobe,
  faPrint,
  faFileArrowDown,
  faExclamation,
  faArrowRotateLeft,
  faDownLeftAndUpRightToCenter,
  faUpRightAndDownLeftFromCenter,
  faChevronLeft,
  faChevronRight,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'

library.add(faXmark)
library.add(faPen)
library.add(faCheck)
library.add(faTrash)
library.add(faPlus)
library.add(faBookOpen)
library.add(faGlobe)
library.add(faPrint)
library.add(faFileArrowDown)
library.add(faExclamation)
library.add(faArrowRotateLeft)
library.add(faDownLeftAndUpRightToCenter)
library.add(faUpRightAndDownLeftFromCenter)
library.add(faChevronLeft)
library.add(faChevronRight)
library.add(faArrowRight)


/** Vuetify */
import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import vuetifyConfig from '../vuetify.config'


const vuetify = createVuetify({
  components,
  directives,
  ...vuetifyConfig,
})


/* init application */
createApp(App)

.use(vuetify)

.mount('#bible-search-app')