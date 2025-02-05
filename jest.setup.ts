/**
 * used to surpress default props warning
 * 
 * As of now (2/4/2025), UI Kitten has not been updated since mid 2023, and one of its
 * elements (MeasureElement) uses default props. Default props will be removed eventually
 * and it needs to be swapped to JS default parameters instead. This has been done in current
 * props, however not in UI Kitten. It is not likely to be updated anytime soon, so for now
 * this will do. If this does break eventually, then we will need to, most likely, fork the
 * github repo and fix it ourselves. Since this is not a lethal error, this will do. -BS
 */
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && args[0].includes('defaultProps will be removed')) {
    return;
  }
  originalWarn(...args);
};