import React from "react";
import BrowserName from "./utils/browser-name";

export function BrowserCompatibilityBrowsers({ displayBrowsers }) {
  return (
    <tr className="bc-browsers">
      <td />
      {displayBrowsers.map((displayBrowser, i) => (
        <th key={i} className={`bc-browser-${displayBrowser}`}>
          <span className={`bc-head-txt-label bc-head-icon-${displayBrowser}`}><BrowserName browserNameKey={displayBrowser}/></span>
        </th>
      ))}
    </tr>
  )
}
