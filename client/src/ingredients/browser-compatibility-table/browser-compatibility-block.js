import React from "react";
import BrowserName from './utils/browser-name'

export function BrowserCompatibilityBlock({ icon, browser, versionAdded, elementType, index, onNotesClick, currentNoteId, children }) {
  let isSupported;
  let textContent;
  let bcSupport;
  let bcIcon;
  let bcIconTitle;
  let hasChildren = (children !== undefined) ? true : false
  switch(versionAdded) {
    case true:
      isSupported = 'yes';
      textContent = 'Yes';
      bcSupport = "Full Support";
      break;
    case false:
      isSupported = 'no';
      textContent = 'No';
      bcSupport = "No Support";
      break;
    case null:
    case undefined:
      isSupported = 'unknown';
      textContent = '?';
      bcSupport = "Compatibility unknown; please update this.";
      break;
    default:
      isSupported = 'yes';
      textContent = `${versionAdded}`;
      bcSupport = "Full Support";
      break;
  }
  switch(icon) {
    case "note":
      bcIcon = "ic-footnote"
      bcIconTitle = "See implementation notes"
      break;
    case "flag":
      bcIcon = "ic-disabled"
      bcIconTitle = "User must explicitly enable this feature."
      break;
    case "prefix":
      bcIcon = "ic-prefix"
      bcIconTitle = "Implemented with a vendor prefix"
      break;
    default:
      break;
  }
  return (
    React.createElement(
    `${elementType}`,
    {
      className: `bc-browser-${browser} bc-supports-${isSupported} ${elementType === 'dt' ? 'bc-supports' : ''}`,
      key: `${browser}-compat`,
      onClick: (hasChildren && (() => {onNotesClick(index)})) || null,
      'aria-expanded': hasChildren ? currentNoteId === index ? "true" : "false" : null,
      'aria-controls': hasChildren ? `${index}` : null,
      tabIndex: hasChildren ? 0 : null
    },
    [
      elementType === 'td' && <span key={`${browser}-name`} className="bc-browser-name"><BrowserName browserNameKey={browser}/></span>,
      <abbr key={`${browser}-support`} className={`bc-level-${isSupported} only-icon`} title={bcSupport}><span>{bcSupport}</span></abbr>,
      <span key={`${browser}-content`}>{textContent}</span>,
      <div key={`${browser}-icons`} className="bc-icons">
        <abbr className="only-icon" title={`${bcIconTitle}`}>
          <span>Notes</span>
          <i className={`${bcIcon}`}></i>
        </abbr>
      </div>,
      children !== undefined && children
    ]
   )
 )
}
