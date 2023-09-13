export const clone_deep = ( object ) => JSON.parse ( JSON.stringify ( object ) )

import bible_structure from '@/assets/js/bible_structure'
export const bible_books_map = Object.keys(bible_structure).reduce( ( obj, book, idx ) => ({ ...obj, [idx + 1]: book}), {})
