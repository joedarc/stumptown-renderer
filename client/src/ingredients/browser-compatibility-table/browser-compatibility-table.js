import React, { Component } from 'react';
import { BrowserCompatibilityPlatforms } from './browser-compatibility-platforms'
import { BrowserCompatibilityBrowsers } from './browser-compatibility-browsers'
import { BrowserCompatibilityRows } from './browser-compatibility-rows'
import { BrowserCompatibilityLegend } from './browser-compatibility-legend'
const browsers = {
  "desktop": ['chrome', 'edge', 'firefox', 'ie', 'opera', 'safari'],
  "mobile": ['webview_android', 'chrome_android', 'firefox_android', 'opera_android', 'safari_ios', 'samsunginternet_android', 'edge_mobile'],
  "server": ['nodejs'],
  "webextensions-desktop": ['chrome', 'edge', 'firefox', 'opera'],
  "webextensions-mobile": ['firefox_android']
};

export default class BrowserCompatibilityTable extends Component {
  constructor (props) {
    super(props);
    this.state = {
      compatibilityData: props.document.browser_compatibility,
      currentNoteId: null,
      hasDeprecation: false,
      hasExperimental: false,
      hasNonStandard: false,
      hasFlag: false,
      hasPrefix: false,
      legendSet: false
    }
    this.onNotesClick = this.onNotesClick.bind(this);
    this.setLegendIcons = this.setLegendIcons.bind(this);
    this.gatherPlatformsAndBrowsers = this.gatherPlatformsAndBrowsers.bind(this);
  }

  componentDidMount() {
    // This is where we can fetch the compatibility data and set state to render the table
  }

  gatherPlatformsAndBrowsers(document, category) {
    let platforms = ['desktop', 'mobile'];
    let displayBrowsers = [...browsers['desktop'], ...browsers['mobile']];
    if (category === 'javascript') {
      displayBrowsers.push(...browsers["server"]);
      platforms.push('server');
    }
    if (category === 'webextensions') {
      displayBrowsers = [...browsers["webextensions-desktop"], ...browsers["webextensions-mobile"]];
      platforms = ['webextensions-desktop', 'webextensions-mobile'];
    }
    return [platforms, displayBrowsers];
  }

  onNotesClick(currentNoteId) {
    if (this.state.currentNoteId && (this.state.currentNoteId === currentNoteId)) {
      this.setState({ currentNoteId: null });
    } else {
      this.setState({currentNoteId: currentNoteId});
    }
  }

  setLegendIcons(hasDeprecation, hasExperimental, hasNonStandard, hasFlag, hasPrefix, hasAlternative) {
    if (!this.state.legendSet) {
      this.setState({
        hasDeprecation: hasDeprecation,
        hasExperimental: hasExperimental,
        hasNonStandard: hasNonStandard,
        hasFlag: hasFlag,
        hasPrefix: hasPrefix,
        hasAlternative: hasAlternative,
        legendSet: true
      });
    }
  }

  render() {
    let [platforms, displayBrowsers] = this.gatherPlatformsAndBrowsers(this.props.document, this.props.category);
    return (
      [
        <table key="bc-table" className="bc-table bc-table-web">
          <thead>
            <BrowserCompatibilityPlatforms platforms={ platforms } browsers={ browsers } />
            <BrowserCompatibilityBrowsers displayBrowsers={ displayBrowsers } />
          </thead>
          <tbody>
            <BrowserCompatibilityRows
              compatibilityData={ this.state.compatibilityData }
              displayBrowsers={ displayBrowsers }
              currentNoteId={ this.state.currentNoteId }
              onNotesClick={ this.onNotesClick }
              setLegendIcons={ this.setLegendIcons }
            />
          </tbody>
        </table>,
        <BrowserCompatibilityLegend
          key={"bc-legend"}
          hasDeprecation={this.state.hasDeprecation}
          hasExperimental={this.state.hasExperimental}
          hasNonStandard={this.state.hasNonStandard}
          hasFlag={this.state.hasFlag}
          hasPrefix={this.state.hasPrefix}
          hasAlternative={this.state.hasAlternative}/>
      ]
    );
  }
}
