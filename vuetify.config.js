import { aliases, fa } from 'vuetify/iconsets/fa'
import { VBtn } from 'vuetify/components/VBtn'
import { VLabel } from 'vuetify/lib/components/index.mjs'

const ovf_colors = {
  gray_dark: '#2e3d4f',
  gray_medium: '#828c96',
  gray_light: '#ccd1d6',
  blue_deep: '#2980ba',
  blue_bright: '#2b96de',
  purple: '#9c57b8',
  red: '#e84d3d',
  orange_deep: '#e87d21',
  orange_bright: '#f29c12',
  yellow: '#f2c40d',
  green_deep: '#00bd9c',
  green_bright: '#52d98c',
}

const default_button_style = {
  'text-transform': 'none',
}

const custom_theme = {
  dark: false,
  colors: {
    background: '#fff',
    surface: ovf_colors.gray_light,
    primary: ovf_colors.blue_bright,
    secondary: ovf_colors.orange_deep,
    error: ovf_colors.red,
    info: ovf_colors.purple,
    success: ovf_colors.green_deep,
    warning: ovf_colors.orange_bright,
    ...ovf_colors,
  },
}

export default {

  display: {
    thresholds: {
      toolbar_main_actions_menu_break_point: 1220,
    }
  },

  theme: {
    defaultTheme: 'custom_theme',
    themes: { custom_theme },
    variations: {
      colors: [
        'surface', 'primary', 'secondary',
        ...Object.keys( ovf_colors ),
      ],
      lighten: 3,
      darken: 3,
    },
  },

  aliases: {
    CircleBtn: VBtn,
    MainActionBtn: VBtn,
    AddNewBtn: VBtn,
  },

  icons: {
    defaultSet: 'fa',
    aliases,
    sets: { fa },
  },

  defaults: {
    VCombobox: {
      density: 'compact',
      variant: 'outlined',
      bgColor: "#fff",
    },

    VBtn: {
      variant: 'flat',
      density: 'compact',
      bgColor: 'surface-lighten-1',
      style: { ...default_button_style },
    },

    AddNewBtn: {
      variant: 'flat',
      // color: 'primary',
      style: { ...default_button_style },
    },

    CircleBtn: {
      variant: 'flat',
      density: 'compact',
      rounded: 'xl',
      bgColor: "#fff",
      style: { ...default_button_style },
    },

    MainActionBtn: {
      variant: 'flat',
      color: 'secondary',
      style: { ...default_button_style },
    },

    VMenu: {
      MainActionBtn: {
        rounded: 0,
      },
    },

    VNavigationDrawer: {
      AddNewBtn: {
        variant: 'outlined'
      },
    },

    VLabel: {
      style: {
        lineHeight: '1',
      },
    },
  },

}