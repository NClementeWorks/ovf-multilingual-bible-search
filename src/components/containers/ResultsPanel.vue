<!-- ResultsPanel -->

<script setup>
  import LanguageListItem from '@/components/blocks/language/LanguageListItem.vue'
  import CiteListItem from '@/components/blocks/passage/CiteListItem.vue'
  import PassageDisplay from '@/components/blocks/passage/PassageDisplay.vue'
  import LanguageSelectNew from '@/components/blocks/language/LanguageSelectNew.vue'
  import LanguageSelectInput from '@/components/blocks/language/LanguageSelectInput.vue'
  import CiteSelector from '@/components/blocks/passage/CiteSelector.vue'
  import CiteSelectNew from '@/components/blocks/passage/CiteSelectNew.vue'
  import LoaderLanguages from '@/components/blocks/loaders/LoaderLanguages.vue'
  import PassageActionButtons from '@/components/blocks/buttons/PassageActionButtons.vue'
  import FAIcon from '@/components/utils/FAIcon.vue'

  import Language from '@/composables/language.composable'
  import Version from '@/composables/version.composable'
  import Cite from '@/composables/cite.composable'
  import Passage from '@/composables/passage.composable'
  import PassageGrouping from '@/composables/passage_grouping.composable'
  import Layout from '@/composables/layout.composable'
  import TextFile from '@/composables/text_file.composable'

  import { ref, watch } from 'vue'

  const active_copyrights = ref ( Language.active_copyrights )
  const generating_doc_file = ref ( TextFile.generating_doc_file )

  watch( TextFile.generating_doc_file, ( new_value ) => {
    generating_doc_file.value = new_value
  })
  
</script>

<template>

  <div class="results_panel">
    <!-- <h1>=={{ TextFile.generating_doc_file }}</h1>
    <h1>=={{ generating_doc_file }}</h1> -->
    
    <div class="passage_group_wrapper">
      <template v-for="( [ group_key, group_data ], idx ) in Object.entries ( PassageGrouping.passages_grouped.value )" :key="group_key">

        <div class="passage_group">
          <h2 v-if="PassageGrouping.grouping_option.value === 'language'">
            <LanguageListItem
              :editable="true"
              :item_key="group_key"
              />
          </h2>
          <h2 v-else-if="PassageGrouping.grouping_option.value === 'passage'">
            <CiteListItem
              :item_key="group_key"
              :editable="true"
              />
          </h2>

          <div>
            <div
              v-for="([ sub_group_key, sub_group_data ]) in Object.entries ( group_data )" :key="sub_group_key"
              class="passage_group_item">

              <!-- --{{ Object.values ( sub_group_data )[0]?.version_id }}-- -->

              <h3
                v-if="PassageGrouping.grouping_option.value === 'language'"
                data-screen_media_only
                >
                <CiteListItem
                  :editable="idx === 0"
                  :item_key="sub_group_key"
                  :font_size="`${Layout.passage_font_sizes.value.scripts [ 
                    Language.all_languages_map.value [ 
                      Version.all_versions_map.value [ 
                        Object.values ( sub_group_data )[0]?.version_id
                      ]?.language_id
                    ]?.script.code
                  ]?.title.points_value}pt`"
                  />
              </h3>

              <div v-for="([ passage_key, passage ]) in Object.entries ( sub_group_data )" :key="passage_key"
                :class="{
                  passage_group_item_detail: PassageGrouping.grouping_option.value === 'passage' || PassageGrouping.by_verse
                }">

                <h3
                  v-if="PassageGrouping.grouping_option.value === 'passage'"
                  data-screen_media_only
                  >
                  <LanguageListItem
                    :editable="idx === 0"
                    :item_key="passage.version_key"
                    :font_size="`${Layout.passage_font_sizes.value.scripts [ Language.all_languages_map.value [ Version.all_versions_map.value [ passage.version_id ]?.language_id ].script.code ].title.points_value}pt`"
                    />
                </h3>

                <PassageDisplay
                  :passage="passage"
                  :version="Version.all_versions_map.value [ passage.version_id ]"
                  />

              </div>
            </div>
          </div>

          <!-- copyrights notices -->
          <span
            v-if="PassageGrouping.grouping_option.value === 'language'"
            class="passage_copyrights text-caption text-medium-emphasis"
            data-print_media_only
            >
            {{ Version.all_versions_map.value [
                Object.values ( Object.values ( group_data )[0] )[0]?.version_id
              ].copyrights.notice  }}
          </span>
          <span
            v-else-if="PassageGrouping.grouping_option.value === 'passage'"
            class="passage_copyrights text-caption text-medium-emphasis"
            data-print_media_only
            >
            <VList
              density="compact"
              class="text-left bg-transparent"
              >
              <VListItem
                v-for="copyrights in active_copyrights"
                :key="copyrights.key"
                >
                <sup>{{ copyrights.index + 1 }}</sup> {{ copyrights.notice }}
              </VListItem>
            </VList>
          </span>

          <div v-if="idx === 0"
            class="new_item_button_wrapper">
            <CiteSelectNew
              v-if="PassageGrouping.grouping_option.value === 'language'"
              />
                
            <span v-else-if="PassageGrouping.grouping_option.value === 'passage'">

              <LoaderLanguages v-if="!Language.languages_loaded.value && !Version.versions_loaded.value" />
              <LanguageSelectNew
                v-else
                />
                    
            </span>
          </div>
        </div>
      </template>
    </div>
    
    <div v-if="Object.entries ( PassageGrouping.passages_grouped.value ).length"
      class="new_item_button_wrapper">
      <span v-if="PassageGrouping.grouping_option.value === 'language'">

        <LoaderLanguages v-if="!Language.languages_loaded.value && !Version.versions_loaded.value" />
        <LanguageSelectNew
          v-else
          />

      </span>&nbsp;
      <CiteSelectNew
        v-else-if="['passage', 'verse'].includes(PassageGrouping.grouping_option.value)"
        />
    </div>
    
    <div v-else>
        
      <LoaderLanguages v-if="!Language.languages_loaded.value && !Version.versions_loaded.value" />

      <div v-else
        class="initial_search_options">

        <div>
          <h2>Choose a Language:</h2>
          <LanguageSelectInput
            class="initial_search_input"
            />
        </div>

        <div>
          <h2>Select a Passage:</h2>

          <CiteSelector
            :embeded="true"
            />
        </div>

        <div>
          <h2>Click Find
            <FAIcon icon="arrow-right" />
          </h2>

          <PassageActionButtons
            :buttons="{
              add: {
                size: 'xl',
                click: () => {
                  if ( Cite.selected_cites?.value?.length
                    && Language.selected_languages?.value?.length )
                    Passage.get_passages ( [ Cite.new_cite_to_add.value ], [ Language.new_langauge_to_add.value ] )
                  
                  else {
                    if ( !Cite.selected_cites?.value?.length )
                      Cite.add_selected_cite ( Cite.new_cite_to_add.value )

                    if ( !Language.selected_languages?.value?.length )
                      Language.add_selected_language ( Language.new_langauge_to_add.value )
                  }
                },
              },
            }"
            />
        </div>
      </div>

    </div>
  </div>




  <!-- <div v-if="generating_doc_file" id="mbs_results_to_doc" class="passage_group_wrapper">
      <template v-for="( [ group_key, group_data ] ) in Object.entries ( PassageGrouping.passages_grouped.value )" :key="group_key">
        
          <div
            v-for="( [ sub_group_key, sub_group_data ] ) in Object.entries ( group_data )" :key="sub_group_key"
            :style="{
              // marginTop: index === 0 ? '12pt' : 0,

            }"
            >

            <div v-for="([ passage_key, passage ]) in Object.entries ( sub_group_data )" :key="passage_key"
              :style="{
                textAlign: Language.all_languages_map.value [
                  Version.all_versions_map.value [
                    passage.version_id
                  ]?.language_id
                ].script.direction === 'RTL'
                  ? 'right'
                  : 'left'
              }"
              >

              <PassageDisplay
                :passage="passage"
                :version="Version.all_versions_map.value [ passage.version_id ]"
                />

            </div>
            <div
              :style="{
                fontSize: '8pt',
                marginTop: '12pt',
                color: 'gray',
              }"
              >
              <div v-if="PassageGrouping.grouping_option.value === 'language'">
                * Permission to use copyrighted texts has been granted, or is pending.
                {{ Version.all_versions_map.value [
                    Object.values ( Object.values ( group_data )[0] )[0]?.version_id
                  ].copyrights.notice  }}
              </div>
            </div>

          </div>
          <div
            :style="{
              fontSize: '8pt',
              marginTop: '12pt',
              color: 'gray',
            }"
            >
            <div v-if="PassageGrouping.grouping_option.value === 'passage'">
              
              <ul
                :style="{
                  listStyle: 'none',
                }"
                >
                <li
                  :style="{
                    margin: '0',
                  }"
                  >Permission to use copyrighted texts has been granted, or is pending.</li>
                <li
                  v-for="copyrights in active_copyrights"
                  :key="copyrights.key"
                  :style="{
                    margin: '0',
                  }"
                  >
                  {{ Version.all_versions_map.value [ copyrights.key ].code.trim() }}:
                  {{ copyrights.notice }}
                </li>
              </ul>
            </div>
          </div>

          <br style="page-break-after: always; clear:both;">

      </template>
      
    </div> -->

</template>

<style lang="sass">
#mbs_main_container
  .results_panel
    padding: 1rem

    h2
      margin: .5rem 0

    h3
      margin: .5rem 0

    .passage_group
      border-bottom: 1px solid #ddd
      border-radius: .5rem
      box-shadow: 0 0 .75rem -.25rem #ccc
      margin-bottom: .5rem
      padding: 1rem
      width: 100%

      &:not(:last-child)
        page-break-after: always

      &:hover
        box-shadow: 0 0 .75rem -.25rem #999

      &_item
        padding: 0 1rem
        position: relative
        border: 1px solid transparent
        margin-top: -1px // make borders overlap to avoid double border lines

        &_detail
          padding: .5rem 0
          position: relative
          border-top: 1px solid transparent
          border-bottom: 1px solid transparent
          border-radius: .5rem

          &:hover
            background: rgba( var( --v-theme-gray_light ), .05)
            border-color: #ddd

        &:hover
          background: rgba( var( --v-theme-gray_light ), .05)
          border-radius: .5rem
          border-color: #ddd

        &::before
          content: ''
          border-bottom: 1px solid #ccc
          height: 100%
          width: calc( 100% - 2rem )
          display: block
          position: absolute
          top: 0
          right: 1rem
          z-index: -1


    .language
      &_label
        justify-content: start
      &_select
        justify-content: start
          
    .cite
      &_label
        justify-content: start
        font-size: 12pt // using pt to keep consistency when printing

      &_select
        justify-content: start
        flex-direction: row

  .initial_search

    &_options
      display: flex
      flex-direction: column
      align-items: baseline

      & > div
        display: flex
        align-items: baseline
        width: 100%
        padding-bottom: 2rem  

        @media ( max-width: 50rem )
          flex-direction: column

        & > h2
          width: 25%
          padding-right: 1rem
          text-align: right
          opacity: .8

          @media ( max-width: 50rem )
            text-align: left

      .action_button.add
        width: 3rem
        height: 3rem
        font-size: 1.25rem

  .new_item_button_wrapper
    padding: .5rem 0
</style>