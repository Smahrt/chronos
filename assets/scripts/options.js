const toggleHour = document.getElementsByClassName('toggle-12-24')[0];
const toggleDarkMode = document.getElementById('switch2');
const view = document.querySelector('body');
const zones = document.querySelector('.zones');
const selectedTimezone = document.querySelector('.timezone span');
const searchZone = document.querySelector('#search-zone');
var allZones = [];

Promise.all([
    fetch('/data/zone.csv'),
    getPreferences(['twentyFourHour', 'preferredTimezone', 'darkModeEnabled'])
  ])
  .then(async res => [processData(await res[0].text()).map(t => t[2]).filter(t => Boolean(t)), res[1]])
  .then(data => {
    // set preference values on load
    toggleHour.checked = data[1].twentyFourHour;
    toggleDarkMode.checked = data[1].darkModeEnabled;
    view.classList[toggleDarkMode.checked ? 'add' : 'remove']('dark-mode');
    selectedTimezone.textContent = data[1].preferredTimezone;
    allZones = data[0];
    renderZones(allZones);
  })
  .catch(console.error);

//Run timer function again to refresh hour format immediately
toggleHour.onclick = function () {
  setPreferences({
    twentyFourHour: toggleHour.checked
  }).then(() => console.log('preferences updated'));
};

// toogle dark mode
toggleDarkMode.onclick = function () {
  setPreferences({
    darkModeEnabled: toggleDarkMode.checked
  }).then(() => {
    view.classList[toggleDarkMode.checked ? 'add' : 'remove']('dark-mode');
  });
};

searchZone.onfocus = function () {
  zones.style.display = 'flex';
};

searchZone.onblur = function () {};

searchZone.onkeyup = function () {
  const val = searchZone.value.toLowerCase();
  if (val && val !== '') {
    renderZones(allZones.filter(z => z.toLowerCase().includes(val)));
  }
};

zones.addEventListener('click', el => {
  const val = el.target.textContent;
  setPreferences({
    preferredTimezone: val
  }).then(() => {
    selectedTimezone.textContent = val;
    zones.style.display = 'none';
    searchZone.value = '';
  });
});

/**
 * Process CSV data
 * @param {string} allText CSV data
 * @returns {string[][]}
 * */
const processData = allText => {
  return allText.split(/\r\n|\n/).map(l => l.split(',').map(s => s.slice(1).slice(null, -1)));
};

/**
 * Renders the time zones in HTML
 * @param {string[]} vals
 *  */
function renderZones(vals) {
  zones.innerHTML = vals.map(v => `<div class="zone">${v}</div>`).join('');
}

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

/**
 * Gets user preferences for the extension
 * @param {string} param
 * @returns {Promise<PreferencesOptions>}
 */
function getPreferences(param) {
  return new Promise(resolve => {
    chrome.storage.sync.get(param, (data) => {
      resolve(data);
    });
  });
}