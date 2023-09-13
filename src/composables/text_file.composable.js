import { bible_books_map } from '@/composables/utils/utils.composable'
import Version from '@/composables/version.composable'
import Language from '@/composables/language.composable'
import PassageGrouping from '@/composables/passage_grouping.composable'
import Layout from '@/composables/layout.composable'

import FileSaver from 'file-saver'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  SectionType,
  HeadingLevel,
  AlignmentType,
  FootnoteReferenceRun,
} from 'docx'

function get_citation_string ( passage ) {
  
  const book_name = bible_books_map [ passage.book_number ]
  const chapter = passage.chapters[ 0 ].number
  const start_verse = passage.chapters[ 0 ].verses[ 0 ].start_number
  const end_verse = passage.chapters[ 0 ].verses[ passage.chapters[0].verses.length - 1 ].end_number
  const version_code = Version.all_versions_map.value [ passage.version_id ].code
  const version_name = Language.all_languages_map.value [ Version.all_versions_map.value [ passage.version_id ].language_id ].name

  return `${ book_name } ${ chapter }:${ start_verse }-${ end_verse } (${ version_code }) - ${ version_name }`
}

/**
 * Export Plain Text file
 */
function generate_text_file () {
  let data_to_save = ''
  const new_line = '\n'

  Object.entries( PassageGrouping.passages_grouped.value ).forEach ( ([ , subgroup ]) => {
    Object.entries( subgroup ).forEach ( ([ , item ]) => {
      Object.entries( item ).forEach ( ([ , passage ]) => {

        data_to_save += get_citation_string( passage ) + new_line

        passage.chapters[ 0 ].verses.forEach ( verse => {
          data_to_save += `${ verse.start_number } ${ verse.text_content } `
        })

        data_to_save += new_line
      })

      data_to_save += new_line
    })

    data_to_save += new_line
  })

  const file_type = "text/plain;charset=utf-8"
  const file_name = "multilingual_bible_search.txt"

  const blob = new Blob ( data_to_save, { type: file_type } );
  FileSaver.saveAs ( blob, file_name );

}

/**
 * Export DocX file
 */
function get_doc_passage_paragraphs ( passage, index ) {

  // get script direction
  const text_alignment = Language.all_languages_map.value [
      Version.all_versions_map.value [
        passage.version_id
      ]?.language_id
    ].script.direction === 'RTL'
    ? AlignmentType.RIGHT
    : AlignmentType.LEFT

  const citation_paragraph_text = [
    new TextRun( get_citation_string( passage ) ),
  ]

  if ( index === 0 ) {
    const copyrights_footnote_index = Language.active_copyrights.value.findIndex( copyrights => {
      return copyrights.key === passage.version_id
    })
    if ( copyrights_footnote_index >= 0 ) {
      citation_paragraph_text.push (
        new FootnoteReferenceRun ( copyrights_footnote_index + 1 )
      )
    }
  }

  const citation_paragraph = new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: text_alignment,
    children: citation_paragraph_text,
  })

  const passage_version = Version.all_versions_map.value [ passage.version_id ]
  const passage_language = Language.all_languages_map.value [ passage_version.language_id ]

  const default_font = 'Times New Roman'
  const script_font_map = {
    ur: 'Jameel Noori Nastaleeq',
    ar: 'Arial',
    zh: 'Arial',
    am: 'Arial',
  }

  const verses_paragraph = new Paragraph({
    alignment: text_alignment,
    children: passage.chapters[ 0 ].verses.flatMap ( verse => {
      return [
        new TextRun({
          text: `${ verse.start_number } `,
          font: script_font_map [ passage_language.script.code ] || default_font,
          size: Math.floor( Layout.passage_font_sizes.value.scripts [ passage_language.script.code ].content.points_value / 0.35 ),
          superScript: true,
          color: '#333333'
        }),
        new TextRun({
          text: `${ verse.text_content } `,
          font: script_font_map [ passage_language.script.code ] || default_font,
          size: Math.floor( Layout.passage_font_sizes.value.scripts [ passage_language.script.code ].content.points_value / 0.5 ),
        })
      ]
    })
  })

  const empty_paragraph = new Paragraph( '' )

  return [
    citation_paragraph,
    verses_paragraph,
    empty_paragraph,
  ]
}

function get_doc_page_content ( subgroup ) {
  const page_content = Object.entries( subgroup ).reduce ( ( all_paragraphs_arr, [ , item ], index ) => {
    const passage_content = Object.entries( item ).reduce ( ( passage_paragraphs_arr, [ , passage ] ) => {
      const passage_content_paragraphs = get_doc_passage_paragraphs ( passage, index )

      return [
        ...passage_paragraphs_arr,
        ...passage_content_paragraphs,
      ]
    }, [] )

    return [
      ...all_paragraphs_arr,
      ...passage_content,
    ]
  }, [] )

  return page_content
}

function generate_doc_file () {
  const document_pages = Object.entries( PassageGrouping.passages_grouped.value ).map ( ( [ , subgroup ], group_index ) => {
    const properties = group_index
      ? {}
      : { type: SectionType.NEXT_PAGE }

    return {
      properties,
      children: get_doc_page_content( subgroup ),
    }
  });

  const all_copyrights_footnotes = Language.active_copyrights.value.reduce ( ( obj, copyrights, index ) => ({
    ...obj,
    [ index ]: { children: [ new Paragraph( copyrights.notice ) ] },
  }), {})

  const footnotes_for_grouping = PassageGrouping.grouping_option.value === 'language'
    ? all_copyrights_footnotes
    : new Array( Object.keys( PassageGrouping.passages_grouped.value ).length )
      .fill( all_copyrights_footnotes )
      .reduce( ( arr, footnotes ) => ([ ...arr, ...Object.values ( footnotes ) ]), [])
      .reduce( ( obj, footnote, index ) => ({ ...obj, [ index ]: footnote }), {})

  const doc = new Document({
    footnotes: footnotes_for_grouping,
    sections: document_pages,
  })

  Packer.toBlob( doc ).then( blob => {
    FileSaver.saveAs ( blob, "example.docx" )
  })
}

export default {

  generate_text_file,
  generate_doc_file,

}