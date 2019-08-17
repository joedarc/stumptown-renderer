import React from "react";
import { BrowserSupportNote } from "./browser-support-note";

function shouldDisplayBlock(blockDisplayed, versionAdded) {
  if (blockDisplayed) {
    return !!versionAdded;
  }

  return true;
}

export function BrowserSupportNotes({ indexNote, blockElementTag, noteElementTag, noBlocks }) {
  let blockDisplayed = false;
  let browserSupportNotes = [];
  let currentNoteContent, currentNote;

  if (Array.isArray(indexNote.support) && indexNote.notes.length === 0) {
    browserSupportNotes.push(
      <BrowserSupportNote
        key={`note-empty-${indexNote.index}`}
        indexNote={indexNote}
        versionAdded={indexNote.support[0].version_added}
        noteContent={currentNoteContent}
        noteType="none"
        blockElementTag={blockElementTag}
        noteElementTag={noteElementTag}
        displayBlock={!noBlocks && shouldDisplayBlock(blockDisplayed, indexNote.support[0].version_added)}
        displayNote={false}
      />
    );
    blockDisplayed = true;
  } else if (indexNote.notes.length > 0) {
    browserSupportNotes.push(
      indexNote.notes.map((note, index) => {
        currentNoteContent = `<abbr class="only-icon" title="See implementation notes"><span>Notes</span><i class="ic-footnote"></i></abbr> ${note}`;
        currentNote = <BrowserSupportNote
                        key={`note-${indexNote.index}-${index}`}
                        indexNote={indexNote}
                        versionAdded={indexNote.version_added}
                        noteContent={currentNoteContent}
                        noteType="note"
                        blockElementTag={blockElementTag}
                        noteElementTag={noteElementTag}
                        displayBlock={!noBlocks && shouldDisplayBlock(blockDisplayed, indexNote.version_added)}
                        displayNote
                      />
        blockDisplayed = true;
        return currentNote;
      })
    );
    blockDisplayed = true;
  }

  if (indexNote.flags.length > 0) {
    browserSupportNotes.push(
      indexNote.flags.map((flag, index) => {
        currentNoteContent = `<abbr class="only-icon" title="User must explicitly enable this feature."><span>Disabled</span><i class="ic-disabled"></i></abbr> From version ${flag.version_added || indexNote.versionAdded}: this feature is behind the <code>${flag.name}</code> ${flag.type} (needs to be set to <code>${flag.value_to_set}</code>). To change preferences in Firefox, visit about:config.`
        return (
          <BrowserSupportNote
            key={`flag-${indexNote.index}-${index}`}
            indexNote={indexNote}
            versionAdded={flag.version_added || indexNote.version_added}
            noteContent={currentNoteContent}
            noteType="flag"
            blockElementTag={blockElementTag}
            noteElementTag={noteElementTag}
            displayBlock={!noBlocks && shouldDisplayBlock(blockDisplayed, flag.version_added)}
            displayNote
          />
        );
      })
    );
  }

  if (indexNote.alternatives.length > 0) {
    browserSupportNotes.push(
      indexNote.alternatives.map((alternative, index) => {
        currentNoteContent = `<abbr class="only-icon" title="Uses the non-standard name: <code>${alternative.alternative_name}</code>"><span>Alternate Name</span><i class="ic-altname"></i></abbr> Uses the non-standard name: <code>${alternative.alternative_name}</code>`
        return (
          <BrowserSupportNote
            key={`alternative-${indexNote.index}-${index}`}
            indexNote={indexNote}
            versionAdded={alternative.version_added}
            versionRemoved={alternative.version_removed}
            noteContent={currentNoteContent}
            noteType="alternative"
            blockElementTag={blockElementTag}
            noteElementTag={noteElementTag}
            displayBlock={!noBlocks && shouldDisplayBlock(blockDisplayed, alternative.version_added)}
            displayNote
          />
        );
      })
    );
  }

  if (indexNote.prefixes.length > 0) {
    browserSupportNotes.push(
      indexNote.prefixes.map((prefix, index) => {
        currentNoteContent = `<abbr class="only-icon" title="Implemented with the vendor prefix: ${prefix.prefix}"><span>Prefixed</span><i class="ic-prefix"></i></abbr>Implemented with the vendor prefix: ${prefix.prefix}`;
        return (
          <BrowserSupportNote
            key={`prefix-${indexNote.index}-${index}`}
            indexNote={indexNote}
            versionAdded={prefix.version_added}
            noteContent={currentNoteContent}
            noteType="prefix"
            blockElementTag={blockElementTag}
            noteElementTag={noteElementTag}
            displayBlock={!noBlocks}
            displayNote
          />
        )
      })
    )
  }

  return browserSupportNotes;
}
