import React from "react";
import { BrowserSupportDetail } from './browser-support-detail';
import { BrowserSupportNotes } from './browser-support-notes';

function buildCompatibility(compatibilityData, displayBrowsers) {
  let features = [];
  if (compatibilityData.__compat !== undefined) {
    features.push ({
      [`${compatibilityData.__compat.mdn_url.split('/').pop()}`]: compatibilityData.__compat
    });
    for(var compat in compatibilityData) {
      if (compat !== "__compat" && compatibilityData[compat]['__compat'] !== undefined) {
        features.push ({
          [compat]: compatibilityData[compat]['__compat']
        });
      }
    }
  }
  return features;
}

function getVersionAdded(support) {
  if (support === undefined) {
    return null;
  } else if (Array.isArray(support)) {
    return getVersion(support[0].version_added);
  } else if (support.prefix) {
    return `${support.version_added}`
  } else {
    return getVersion(support.version_added);
  }
}

function getVersion(version_added) {
  if (version_added !== null && version_added !== undefined) {
    return version_added;
  } else {
    return null
  }
}

function buildIndexNotes(browserSupportDetails, rowIndex, currentNoteId, hasFlag, hasPrefix) {
  return [
    browserSupportDetails.map((browserSupportDetail, detailIndex) => {
      let currentSupport = browserSupportDetail.support;
      if (Array.isArray(currentSupport)) {
        if (!hasFlag && currentSupport[0].flags !== undefined) { hasFlag = true }
        if (!hasPrefix && currentSupport[1].prefix !== undefined) { hasPrefix = true }
        return {
          index: `${rowIndex}-${detailIndex}`,
          browser: browserSupportDetail.browser,
          support: currentSupport,
          prefix: { prefix: currentSupport[1].prefix, versionAdded: currentSupport[1].version_added },
          notes: currentSupport[0].notes || null,
          flags: currentSupport[0].flags || null,
          versionAdded: browserSupportDetail.versionAdded
        }
      }
      else {
        if (currentSupport !== undefined && !hasFlag && currentSupport.flags !== undefined) { hasFlag = true }
        if (currentSupport !== undefined && !hasPrefix && currentSupport.prefix !== undefined) { hasPrefix = true }
        return {
          index: `${rowIndex}-${detailIndex}`,
          browser: browserSupportDetail.browser,
          support: currentSupport,
          prefix: currentSupport !== undefined ? currentSupport.prefix !== undefined ? { prefix: currentSupport.prefix, versionAdded: currentSupport.version_added } : null : null,
          notes: currentSupport !== undefined ? currentSupport.notes || null : null,
          flags: currentSupport !== undefined ? currentSupport.flags || null : null,
          versionAdded: browserSupportDetail.versionAdded
        };
      }
    })
    .filter(indexNotes => ((!!indexNotes.notes || !!indexNotes.flags || !!indexNotes.prefix) && `bc-history-${indexNotes.index}` === currentNoteId)),
    hasFlag,
    hasPrefix
  ]
}

export function BrowserCompatibilityRows({ compatibilityData, displayBrowsers, onNotesClick, currentNoteId, setLegendIcons }) {
  const compatibilityRows = buildCompatibility(compatibilityData, displayBrowsers);
  let hasDeprecation, hasExperimental, hasNonStandard, hasFlag, hasPrefix = false;
  let indexNotes;
  const browserCompatibilityRows = compatibilityRows.map((compatibilityRow, rowIndex) => {
    for (const element in compatibilityRow) {
      let currentRow = compatibilityRow[element];
      if (!hasDeprecation && currentRow.status.deprecated) { hasDeprecation = true }
      if (!hasExperimental && currentRow.status.experimental) { hasExperimental = true }
      if (!hasNonStandard && !currentRow.status.standard_track) { hasNonStandard = true }
      const browserSupportDetails = displayBrowsers.map((browser) => {
        let currentSupport = currentRow.support[browser]
        return {
          browser: browser,
          support: currentSupport,
          versionAdded: getVersionAdded(currentSupport)
        };
      });
      [indexNotes, hasFlag, hasPrefix] = buildIndexNotes(browserSupportDetails, rowIndex, currentNoteId, hasFlag, hasPrefix)
      return [
        <tr key={rowIndex}>
          <th scope="row">
            <code>{element}</code>
              <div className="bc-icons">
                { currentRow.status.deprecated &&
        					<abbr className="only-icon" title="Deprecated. Not for use in new websites.">
        						<span>Deprecated</span>
        						<i className="ic-deprecated" />
        					</abbr>
                }
                { !currentRow.status.standard_track &&
                  <abbr className="only-icon" title="Non-standard. Expect poor cross-browser support.">
                    <span>Non-standard</span>
                    <i className="ic-non-standard" />
                  </abbr>
                }
                { currentRow.status.experimental &&
                  <abbr className="only-icon" title="Experimental. Expect behavior to change in the future.">
                    <span>Experimental</span>
                    <i className="ic-experimental" />
                  </abbr>
                }
        		  </div>
          </th>
          {browserSupportDetails.map((browserSupportDetail, detailIndex) => {
            return <BrowserSupportDetail key={`${rowIndex}-${detailIndex}`} index={`${rowIndex}-${detailIndex}`} browser={browserSupportDetail.browser} support={browserSupportDetail.support} versionAdded={browserSupportDetail.versionAdded} currentNoteId={currentNoteId} onNotesClick={onNotesClick} indexNote={indexNotes.find(indexNotes => (indexNotes.index === `${rowIndex}-${detailIndex}`))} />
          })}
       </tr>,
       ...indexNotes.map((indexNote) => {
         return (
           <tr key={`notes-${indexNote.index}`} id={`bc-history-${indexNote.index}`} className="bc-history" aria-hidden="false">
             <th scope="row" />
             <td colSpan={browserSupportDetails.length}>
               <dl>
                 <BrowserSupportNotes key={`${indexNote.index}`} indexNote={indexNote} blockElementType="dt" noteElementType="dd" />
               </dl>
             </td>
           </tr>
         )
       })
     ];
    }
    return true;
  })
  setLegendIcons(hasDeprecation, hasExperimental, hasNonStandard, hasFlag, hasPrefix);
  return browserCompatibilityRows;
}
