import React from "react";
import { BrowserSupportNote } from './browser-support-note';

export function BrowserSupportNotes({ indexNote, blockElementType, noteElementType, noBlocks }) {
  console.log(indexNote);
  let prefixDisplayed, blockDisplayed = false;
  let browserSupportNotes = [];
  let currentNoteContent;
  if (indexNote.support.prefix !== undefined) {
    currentNoteContent = `<abbr class="only-icon" title="Implemented with the vendor prefix: ${indexNote.prefix.prefix}"><span>Prefixed</span><i class="ic-prefix"></i></abbr>Implemented with the vendor prefix: ${indexNote.prefix.prefix}`;
    browserSupportNotes.push(
      <BrowserSupportNote key={`${indexNote.index}-note-block`} indexNote={indexNote} versionAdded={indexNote.prefix.versionAdded} noteContent={currentNoteContent} noteType="prefix" blockElementType={blockElementType} noteElementType={noteElementType} displayBlock={noBlocks ? false : true} displayNote />
    );
    prefixDisplayed = true;
  } else if (indexNote.support !== undefined && Array.isArray(indexNote.support)){
    browserSupportNotes.push(
      <BrowserSupportNote key={`${indexNote.index}-note-block`} indexNote={indexNote} versionAdded={indexNote.support[0].version_added} noteContent={currentNoteContent} noteType="none" blockElementType={blockElementType} noteElementType={noteElementType} displayBlock={noBlocks ? false : blockDisplayed ? false : true} displayNote={false} />
    );
    blockDisplayed = true;
  }
  if (indexNote.notes !== null) {
    if(Array.isArray(indexNote.notes)) {
      browserSupportNotes.push(
        indexNote.notes.map((note, index) => {
          currentNoteContent = note;
          return (
            <BrowserSupportNote key={`${indexNote.index}-note-${index}`} indexNote={indexNote} versionAdded={indexNote.versionAdded} noteContent={currentNoteContent} noteType="note" blockElementType={blockElementType} noteElementType={noteElementType} displayBlock={noBlocks ? false : blockDisplayed ? false : true} displayNote />
          )
        })
      );
      blockDisplayed = true;
    } else {
      currentNoteContent = indexNote.notes;
      browserSupportNotes.push(
        <BrowserSupportNote key={`${indexNote.index}-note`} indexNote={indexNote} versionAdded={indexNote.versionAdded} noteContent={currentNoteContent} noteType="note" blockElementType={blockElementType} noteElementType={noteElementType} displayBlock={noBlocks ? false : blockDisplayed ? false : true} displayNote />
      );
      blockDisplayed = true;
    }
  }
  if (indexNote.flags !== null) {
    browserSupportNotes.push(
      indexNote.flags.map((flag, index) => {
        currentNoteContent = `<abbr class="only-icon" title="User must explicitly enable this feature."><span>Disabled</span><i class="ic-disabled"></i></abbr> From version ${flag.version_added || indexNote.versionAdded}: this feature is behind the <code>${flag.name}</code> ${flag.type} (needs to be set to <code>${flag.value_to_set}</code>). To change preferences in Firefox, visit about:config.`
        return (
          <BrowserSupportNote key={`${indexNote.index}-flag-${index}`} indexNote={indexNote} versionAdded={flag.version_added || indexNote.versionAdded} noteContent={currentNoteContent} noteType="flag" blockElementType={blockElementType} noteElementType={noteElementType} displayBlock={noBlocks ? false : blockDisplayed ? flag.version_added !== undefined ? true : false : true} displayNote />
        )
      })
    );
  }
  if (indexNote.prefix !== null && !prefixDisplayed) {
    currentNoteContent = `<abbr class="only-icon" title="Implemented with the vendor prefix: ${indexNote.prefix.prefix}"><span>Prefixed</span><i class="ic-prefix"></i></abbr>Implemented with the vendor prefix: ${indexNote.prefix.prefix}`;
    browserSupportNotes.push(
      <BrowserSupportNote key={`${indexNote.index}-note-block-prefix`} indexNote={indexNote} versionAdded={indexNote.prefix.versionAdded} noteContent={currentNoteContent} noteType="prefix" blockElementType={blockElementType} noteElementType={noteElementType} displayBlock={noBlocks ? false : true} displayNote />
    );
  }
  return (
   browserSupportNotes
  )
}
