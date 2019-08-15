import React from "react";
import { BrowserSupportDetail } from "./browser-support-detail";
import { BrowserSupportNotes } from "./browser-support-notes";

function buildCompatibility(compatibilityData, displayBrowsers) {
  let features = [];
  if (compatibilityData.__compat !== undefined) {
    features.push ({
      [`${compatibilityData.__compat.mdn_url.split('/').pop()}`]: compatibilityData.__compat
    });
    for(var compat in compatibilityData) {
      if (compat !== "__compat" && !!compatibilityData[compat]["__compat"]) {
        features.push ({
          [compat]: compatibilityData[compat]["__compat"]
        });
      }
    }
  }
  return features;
}

function getVersionAdded(support) {
  if (support === undefined) {
    return null;
  }
  if (Array.isArray(support)) {
    return support[0].version_added;
  }
  if (support.prefix) {
    return `${support.version_added}`;
  }
  return support.version_added;
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
      let [currentNotes, currentFlags, currentPrefixes, currentAlternatives] = [[], [], [], []];
      let currentSupport = browserSupportDetail.support;
      if (Array.isArray(currentSupport)) {
        for (var support of currentSupport) {
          if (support.alternative_name) {
            if (!hasAlternative) { hasAlternative = true; }
            currentAlternatives.push(support);
          } else if (support.prefix) {
            if (!hasPrefix) { hasPrefix = true; }
            currentPrefixes.push(support);
          } else if (support.flags) {
            if (!hasFlag) { hasFlag = true; }
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
        };
      }
      else {
        if (!hasFlag) { hasFlag = !!(currentSupport && currentSupport.flags); }
        if (!hasPrefix) { hasPrefix = !!(currentSupport && currentSupport.prefix); }
        return {
          index: `${rowIndex}-${detailIndex}`,
          browser: browserSupportDetail.browser,
          support: currentSupport,
          prefixes: !!currentSupport && !!currentSupport.prefix
                      ? [{ prefix: currentSupport.prefix, version_added: currentSupport.version_added }]
                      : [],
          alternatives: !!currentSupport && !!currentSupport.alternative_name
                          ? [{ alternative_name: currentSupport.alternative_name, version_added: currentSupport.version_added, version_removed: currentSupport.version_removed }]
                          : [],
          notes: gatherNotesForIndexNote(currentSupport),
          flags: !!currentSupport ? currentSupport.flags || [] : [],
          version_added: browserSupportDetail.version_added
        };
      }
    })
    .filter(indexNotes => ((!!indexNotes.notes || !!indexNotes.flags || !!indexNotes.prefix) && `bc-history-${indexNotes.index}` === currentNoteId)),
    hasFlag,
    hasPrefix,
    hasAlternative
  ];
}

// Find and return notes inside a support object and return as an array
function gatherNotesForIndexNote(currentSupport) {
  if (!currentSupport) { return []; }
  if (Array.isArray(currentSupport.notes)) {
    return currentSupport.notes;
  } else {
    if (!!currentSupport.notes) {
      return [currentSupport.notes];
    } else {
      return [];
    }
  }
}

export function BrowserCompatibilityRows({ compatibilityData, displayBrowsers, onNotesClick, currentNoteId, setLegendIcons }) {
  const compatibilityRows = buildCompatibility(compatibilityData, displayBrowsers);
  let [hasDeprecation, hasExperimental, hasNonStandard, hasFlag, hasPrefix, hasAlternative] = [false, false, false, false, false, false];
  let indexNotes;
  const browserCompatibilityRows = compatibilityRows.map((compatibilityRow, rowIndex) => {
    for (const element in compatibilityRow) {
      let currentRow = compatibilityRow[element];
      if (!hasDeprecation) { hasDeprecation = !!currentRow.status.deprecated; }
      if (!hasExperimental) { hasExperimental = !!currentRow.status.experimental; }
      if (!hasNonStandard) { hasNonStandard = !!currentRow.status.standard_track; }
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
          <RenderBrowserSupportDetails
            browserSupportDetails={browserSupportDetails}
            rowIndex={rowIndex}
            indexNotes={indexNotes}
            currentNoteId={currentNoteId}
            onNotesClick={onNotesClick} />
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
