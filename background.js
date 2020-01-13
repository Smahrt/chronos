/**
 * Preferences Options Type Definition
 * @typedef {object} PreferencesOptions
 * @property {string} preferredTimezone
 * @property {boolean} twentyFourHour
 */

chrome.runtime.onInstalled.addListener(function () {
  // set defaults
  setPreferences({
    preferredTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    twentyFourHour: true
  });
});

/**
 * Sets user preferences for the extension
 * @param {PreferencesOptions} opts
 * @returns {Promise<void>}
 */
function setPreferences(opts) {
  return new Promise(resolve => {
    chrome.storage.sync.set(opts, () => {
      resolve();
    });
  });
}