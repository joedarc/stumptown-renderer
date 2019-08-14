import React from "react";

export function BrowserCompatibilityPlatforms({ platforms, browsers }) {
  return (
    <tr className="bc-platforms">
      <td />
      {platforms.map((platform, i) => (
        <th key={i} className={`bc-platform-${platform}`} colSpan={Object.keys(browsers[platform]).length}><span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span></th>
      ))}
    </tr>
  )
}
