export default function BrowserName({ browserNameKey }) {
  let firstChar;
  switch(browserNameKey) {
    case 'chrome':
    case 'edge':
    case 'firefox':
    case 'opera':
    case 'safari':
        firstChar = browserNameKey.charAt(0);
        return browserNameKey.replace(firstChar, firstChar.toUpperCase());
    case 'ie':
        return browserNameKey.toUpperCase();
    case 'webview_android':
        return 'WebView Android';
    case 'chrome_android':
        return 'Chrome Android';
    case 'firefox_android':
        return 'Firefox Android';
    case 'opera_android':
        return 'Opera Android';
    case 'safari_ios':
        return 'Safari iOS';
    case 'samsunginternet_android':
        return 'Samsung Internet';
    case 'edge_mobile':
        return 'Edge Android';
    default:
        return browserNameKey;
  }
}
