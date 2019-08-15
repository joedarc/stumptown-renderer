import React from "react";

export function BrowserSupportNoteContent({ noteContent, elementTag }) {
  return (
    React.createElement(
    `${elementTag}`,
    {
      dangerouslySetInnerHTML: {__html: noteContent}
    }
   )
  )
}
