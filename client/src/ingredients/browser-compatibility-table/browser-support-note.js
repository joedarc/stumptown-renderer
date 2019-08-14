import React from "react";
import { BrowserCompatibilityBlock } from './browser-compatibility-block';
import { BrowserSupportNoteContent } from './browser-support-note-content';

export function BrowserSupportNote({ indexNote, versionAdded, versionRemoved, noteContent, noteType, blockElementType, noteElementType, displayBlock, displayNote }) {
  let note = []
  if (displayBlock) {
    note.push(
      <BrowserCompatibilityBlock key={`block-${indexNote.index}`} icon={noteType} browser={indexNote.browser} versionAdded={versionAdded} versionRemoved={versionRemoved} elementType={blockElementType} />
    );
  }
  if (displayNote) {
    note.push(
      <BrowserSupportNoteContent key={`note-${indexNote.index}`} noteContent={noteContent} elementType={noteElementType} />
    );
  } else {
    note.push(
      React.createElement(
        noteElementType,
        {
          key: `note-${indexNote.index}`,
          className: "padded-note"
        },
        <span/>
      )
    )
  }
  return note;
}
