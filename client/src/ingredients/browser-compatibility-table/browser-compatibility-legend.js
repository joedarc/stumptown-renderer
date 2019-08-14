import React from "react";

export function BrowserCompatibilityLegend({ hasDeprecation, hasExperimental, hasNonStandard, hasFlag, hasPrefix }) {
  return (
    <section className="bc-legend" id="sect9">
       <h3 className="offscreen highlight-spanned" id="Legend"><span className="highlight-span">Legend</span></h3>
       <dl>
          <dt><span className="bc-supports-yes bc-supports">
             <abbr className="bc-level bc-level-yes only-icon" title="Full support">
             <span>Full support</span>
             &nbsp;
             </abbr></span>
          </dt>
          <dd>Full support</dd>
          <dt><span className="bc-supports-no bc-supports">
             <abbr className="bc-level bc-level-no only-icon" title="No support">
             <span>No support</span>
             &nbsp;
             </abbr></span>
          </dt>
          <dd>No support</dd>
          <dt><span className="bc-supports-unknown bc-supports">
             <abbr className="bc-level bc-level-unknown only-icon" title="Compatibility unknown">
             <span>Compatibility unknown</span>
             &nbsp;
             </abbr></span>
          </dt>
          <dd>Compatibility unknown</dd>
          <dt><abbr className="only-icon" title="See implementation notes."><span>See implementation notes.</span><i className="ic-footnote"></i></abbr></dt>
          <dd>See implementation notes.</dd>
          {hasDeprecation &&
            [
              <dt key="deprecated-dt"><abbr className="only-icon" title="Deprecated. Not for use in new websites."><span>Deprecated. Not for use in new websites.</span><i className="ic-deprecated"></i></abbr></dt>,
              <dd key="deprecated-dd">Deprecated. Not for use in new websites.</dd>
            ]
          }
          {hasExperimental &&
            [
              <dt key="experimental-dt"><abbr className="only-icon" title="Experimental. Expect behavior to change in the future."><span>Experimental. Expect behavior to change in the future.</span><i className="ic-experimental"></i></abbr></dt>,
              <dd key="experimental-dd">Experimental. Expect behavior to change in the future.</dd>
            ]
          }
          {hasNonStandard &&
            [
              <dt key="standard-dt"><abbr className="only-icon" title="Non-standard. Expect poor cross-browser support."><span>Non-standard. Expect poor cross-browser support.</span><i className="ic-non-standard"></i></abbr></dt>,
              <dd key="standard-dd">Non-standard. Expect poor cross-browser support.</dd>
            ]
          }
          {hasFlag &&
            [
              <dt key="flag-dt"><abbr className="only-icon" title="User must explicitly enable this feature."><span>User must explicitly enable this feature.</span><i className="ic-disabled"></i></abbr></dt>,
              <dd key="flag-dd">User must explicitly enable this feature.</dd>
            ]
          }
          {hasPrefix &&
            [
              <dt key="prefix-dt"><abbr className="only-icon" title="Requires a vendor prefix or different name for use."><span>Requires a vendor prefix or different name for use.</span><i className="ic-prefix"></i></abbr></dt>,
              <dd key="prefix-dd">Requires a vendor prefix or different name for use.</dd>
            ]
          }
       </dl>
    </section>
  )
}
