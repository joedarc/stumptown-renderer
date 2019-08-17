import React from "react";
import { BrowserCompatibilityBlock } from "./browser-compatibility-block";
import { BrowserSupportNoteContent } from "./browser-support-note-content";

export function BrowserSupportNote({ indexNote, versionAdded, versionRemoved, noteContent, noteType, blockElementTag, noteElementTag, displayBlock, displayNote }) {
  const note = [];
  if (displayBlock) {
    note.push(
      <BrowserCompatibilityBlock
        key={`block-${indexNote.index}`}
        icon={noteType}
        browser={indexNote.browser}
        versionAdded={versionAdded}
        versionRemoved={versionRemoved}
        elementTag={blockElementTag}
      />
    );
  }
  if (displayNote) {
    note.push(
      <BrowserSupportNoteContent
        key={`note-${indexNote.index}`}
        noteContent={noteContent}
        elementTag={noteElementTag}
      />
    );
  } else {
    note.push(
      React.createElement(
        noteElementTag,
        {
          key: `note-${indexNote.index}`,
          className: "padded-note"
        },
        <span/>
      )
    );
  }
  return note;
}
