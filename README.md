# OVF Multilingual Bible Search

A Bible search application to help multi-lingual church communities.
[See this project at work](https://onevoicefellowship.org/bible-search)

This application allows for people to search for multiple Bible passages simultaneously in multiple languages. The results can be grouped by language, passage, or verse by verse and can be exported as a Word Document, plain text file or printed out.

The oridginal purpose was to provide members in One Voice Fellowship church with multilingual handouts non-English speakers could follow. Please, read our use case article at [Multilingual Bible Search](http://nolianiclemente.com/use_cases/multilingual-bible-search#the-challenge)

I kindly ask you request permission to fork or copy this project at [noliani@onevoicefellowship.org](mailto:noliani@onevoicefellowship.org). Thanks :-)

## Project Development

Application developed with Vue 3 and Vuetify in Vite. It fetches data from a custom API built in WordPress and currently provided at the [One Voice Fellowship website ](https://onevoicefellowship.org). This API relies on Public Domain and Creative Commons licensed Bibles hosted in the local WordPress database.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
