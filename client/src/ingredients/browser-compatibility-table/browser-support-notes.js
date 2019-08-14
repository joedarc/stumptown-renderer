import React from "react";
import { BrowserSupportNote } from './browser-support-note';

export function BrowserSupportNotes({ indexNote, blockElementType, noteElementType, noBlocks }) {
  let prefixDisplayed, blockDisplayed = false;
  let browserSupportNotes = [];
  let currentNoteContent, currentNote;
  if (indexNote.support.prefix !== undefined) {
    currentNoteContent = `<abbr class="only-icon" title="Implemented with the vendor prefix: ${indexNote.prefixes[0].prefix}"><span>Prefixed</span><i class="ic-prefix"></i></abbr>Implemented with the vendor prefix: ${indexNote.prefixes[0].prefix}`;
    browserSupportNotes.push(
      <BrowserSupportNote
        key={`${indexNote.index}-note-block`}
        indexNote={indexNote}
        versionAdded={indexNote.prefixes[0].version_added}
        noteContent={currentNoteContent}
        noteType="prefix"
        blockElementType={blockElementType}
        noteElementType={noteElementType}
        displayBlock={noBlocks ? false : true}
        displayNote
      />
    );
    prefixDisplayed = true;
  } else if (indexNote.support !== undefined && Array.isArray(indexNote.support)){
    browserSupportNotes.push(
      <BrowserSupportNote
        key={`${indexNote.index}-note-block`}
        indexNote={indexNote}
        versionAdded={indexNote.support[0].version_added}
        noteContent={currentNoteContent}
        noteType="none"
        blockElementType={blockElementType}
        noteElementType={noteElementType}
        displayBlock={noBlocks ? false : blockDisplayed ? false : true}
        displayNote={false}
      />
    );
    blockDisplayed = true;
  }
  if (indexNote.notes.length !== 0) {
    browserSupportNotes.push(
      indexNote.notes.map((note, index) => {
        currentNoteContent = `<abbr class="only-icon" title="See implementation notes"><span>Notes</span><i class="ic-footnote"></i></abbr> ${note}`;
        currentNote = <BrowserSupportNote
                        key={`${indexNote.index}-note-${index}`}
                        indexNote={indexNote}
                        versionAdded={indexNote.version_added}
                        noteContent={currentNoteContent}
                        noteType="note"
                        blockElementType={blockElementType}
                        noteElementType={noteElementType}
                        displayBlock={noBlocks ? false : blockDisplayed ? false : true}
                        displayNote
                      />
        blockDisplayed = true;
        return currentNote;
      })
    );
    blockDisplayed = true;
  }
  if (indexNote.flags.length !== 0) {
    browserSupportNotes.push(
      indexNote.flags.map((flag, index) => {
        currentNoteContent = `<abbr class="only-icon" title="User must explicitly enable this feature."><span>Disabled</span><i class="ic-disabled"></i></abbr> From version ${flag.version_added || indexNote.versionAdded}: this feature is behind the <code>${flag.name}</code> ${flag.type} (needs to be set to <code>${flag.value_to_set}</code>). To change preferences in Firefox, visit about:config.`
        return (
          <BrowserSupportNote
            key={`${indexNote.index}-flag-${index}`}
            indexNote={indexNote}
            versionAdded={flag.version_added || indexNote.version_added}
            noteContent={currentNoteContent}
            noteType="flag"
            blockElementType={blockElementType}
            noteElementType={noteElementType}
            displayBlock={noBlocks ? false : blockDisplayed ? flag.version_added !== undefined ? true : false : true}
            displayNote
          />
        )
      })
    );
  }
  if (indexNote.alternatives.length !== 0) {
    browserSupportNotes.push(
      indexNote.alternatives.map((alternative, index) => {
        currentNoteContent = `<abbr class="only-icon" title="Uses the non-standard name: <code>${alternative.alternative_name}</code>"><span>Alternate Name</span><i class="ic-altname"></i></abbr> Uses the non-standard name: <code>${alternative.alternative_name}</code>`
        return (
          <BrowserSupportNote
            key={`${indexNote.index}-alternative-${index}`}
            indexNote={indexNote}
            versionAdded={alternative.version_added}
            versionRemoved={alternative.version_removed}
            noteContent={currentNoteContent}
            noteType="alternative"
            blockElementType={blockElementType}
            noteElementType={noteElementType}
            displayBlock={noBlocks ? false : blockDisplayed ? alternative.version_added !== undefined ? true : false : true}
            displayNote
          />
        )
      })
    );
  }
  if (indexNote.prefixes.length !== 0 && !prefixDisplayed) {
    browserSupportNotes.push(
      indexNote.prefixes.map((prefix, index) => {
        currentNoteContent = `<abbr class="only-icon" title="Implemented with the vendor prefix: ${prefix.prefix}"><span>Prefixed</span><i class="ic-prefix"></i></abbr>Implemented with the vendor prefix: ${prefix.prefix}`;
        return (
          <BrowserSupportNote
            key={`${indexNote.index}-note-block-prefix-${index}`}
            indexNote={indexNote}
            versionAdded={prefix.version_added}
            noteContent={currentNoteContent}
            noteType="prefix"
            blockElementType={blockElementType}
            noteElementType={noteElementType}
            displayBlock={noBlocks ? false : true}
            displayNote
          />
        )
      })
    )
  }
  return browserSupportNotes
}
