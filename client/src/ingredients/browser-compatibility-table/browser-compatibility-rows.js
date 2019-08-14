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

function getIndexNoteForBrowserDetail(indexNotes, browserDetailIndex) {
  return indexNotes.find(indexNotes => (indexNotes.index === browserDetailIndex));
}

function RenderBrowserSupportDetails({browserSupportDetails, rowIndex, indexNotes, currentNoteId, onNotesClick}) {
  return browserSupportDetails.map((browserSupportDetail, detailIndex) =>
    <BrowserSupportDetail
      key={`${rowIndex}-${detailIndex}`}
      index={`${rowIndex}-${detailIndex}`}
      browser={browserSupportDetail.browser}
      support={browserSupportDetail.support}
      versionAdded={browserSupportDetail.version_added}
      currentNoteId={currentNoteId}
      onNotesClick={onNotesClick}
      indexNote={getIndexNoteForBrowserDetail(indexNotes, `${rowIndex}-${detailIndex}`)}
    />
  )
}

function buildIndexNotes(browserSupportDetails, rowIndex, currentNoteId, hasFlag, hasPrefix, hasAlternative) {
  return [
    browserSupportDetails.map((browserSupportDetail, detailIndex) => {
      let currentNotes = [];
      let currentFlags = [];
      let currentPrefixes = [];
      let currentAlternatives = [];
      let currentSupport = browserSupportDetail.support;
      if (Array.isArray(currentSupport)) {
        for (var support of currentSupport) {
          if (support.alternative_name) {
            if (!hasAlternative) { hasAlternative = true }
            currentAlternatives.push(support);
          } else if (support.prefix) {
            if (!hasPrefix) { hasPrefix = true }
            currentPrefixes.push(support);
          } else if (support.flags) {
            if (!hasFlag) { hasFlag = true }
            currentFlags.concat(support.flags);
          } else if (support.notes) {
            Array.isArray(support.notes) ? currentNotes.concat(support.notes) : currentNotes.push(support.notes);
          }
        }
        return {
          index: `${rowIndex}-${detailIndex}`,
          browser: browserSupportDetail.browser,
          support: currentSupport,
          prefixes: currentPrefixes,
          alternatives: currentAlternatives,
          notes: currentNotes,
          flags: currentFlags,
          version_added: browserSupportDetail.version_added
        }
      }
      else {
        if (currentSupport !== undefined && !hasFlag && currentSupport.flags !== undefined) { hasFlag = true }
        if (currentSupport !== undefined && !hasPrefix && currentSupport.prefix !== undefined) { hasPrefix = true }
        return {
          index: `${rowIndex}-${detailIndex}`,
          browser: browserSupportDetail.browser,
          support: currentSupport,
          prefixes: currentSupport !== undefined && currentSupport.prefix !== undefined
                      ? [{ prefix: currentSupport.prefix, version_added: currentSupport.version_added }]
                      : [],
          alternatives: currentSupport !== undefined && currentSupport.alternative_name !== undefined
                          ? [{ alternative_name: currentSupport.alternative_name, version_added: currentSupport.version_added, version_removed: currentSupport.version_removed }]
                          : [],
          notes: currentSupport !== undefined
                   ? Array.isArray(currentSupport.notes)
                     ? currentSupport.notes
                     : currentSupport.notes === undefined
                       ? []
                       : [currentSupport.notes]
                   : [],
          flags: currentSupport !== undefined ? currentSupport.flags || [] : [],
          version_added: browserSupportDetail.version_added
        };
      }
    })
    .filter(indexNotes => ((!!indexNotes.notes || !!indexNotes.flags || !!indexNotes.prefix) && `bc-history-${indexNotes.index}` === currentNoteId)),
    hasFlag,
    hasPrefix,
    hasAlternative
  ]
}

export function BrowserCompatibilityRows({ compatibilityData, displayBrowsers, onNotesClick, currentNoteId, setLegendIcons }) {
  const compatibilityRows = buildCompatibility(compatibilityData, displayBrowsers);
  let hasDeprecation, hasExperimental, hasNonStandard, hasFlag, hasPrefix, hasAlternative = false;
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
          version_added: getVersionAdded(currentSupport)
        };
      });
      [indexNotes, hasFlag, hasPrefix, hasAlternative] = buildIndexNotes(browserSupportDetails, rowIndex, currentNoteId, hasFlag, hasPrefix, hasAlternative);
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
          <RenderBrowserSupportDetails browserSupportDetails={browserSupportDetails} rowIndex={rowIndex} indexNotes={indexNotes} currentNoteId={currentNoteId} onNotesClick={onNotesClick} />
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
  setLegendIcons(hasDeprecation, hasExperimental, hasNonStandard, hasFlag, hasPrefix, hasAlternative);
  return browserCompatibilityRows;
}
