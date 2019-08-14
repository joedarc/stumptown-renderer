import React from "react";

export function BrowserSupportNoteContent({ noteContent, elementType }) {
  return (
    React.createElement(
    `${elementType}`,
    {
      dangerouslySetInnerHTML: {__html: noteContent}
    }
   )
  )
}
