/*-------------------*/
/*Clock Functionality*/

//Selectors
const wrapperEl = document.getElementById('wrapper');
const footerEl = document.getElementById('footer-wrapper');
const numSecond_Digit1 = document.querySelectorAll('.num-second .digit1')[0];
const numSecond_Digit2 = document.querySelectorAll('.num-second .digit2')[0];
const numSecondArray = [numSecond_Digit1, numSecond_Digit2];

const numMinute_Digit1 = document.querySelectorAll('.num-minute .digit1')[0];
const numMinute_Digit2 = document.querySelectorAll('.num-minute .digit2')[0];
const numMinuteArray = [numMinute_Digit1, numMinute_Digit2];

const numHour_Digit1 = document.querySelectorAll('.num-hour .digit1')[0];
const numHour_Digit2 = document.querySelectorAll('.num-hour .digit2')[0];
const numHourArray = [numHour_Digit1, numHour_Digit2];

const toggleHour = document.getElementsByClassName('toggle-12-24')[0];
const ampm = document.getElementsByClassName('ampm')[0];
const timezoneText = document.querySelector('.footer-wrapper');

getPreferences(['twentyFourHour', 'preferredTimezone', 'darkModeEnabled'])
	.then(res => {
		timezoneText.textContent = res.preferredTimezone;
		timer(res.twentyFourHour, res.preferredTimezone);
		setInterval(() => timer(res.twentyFourHour, res.preferredTimezone), 1000);
		if(res.darkModeEnabled === true){
			footerEl.classList.add('dark-footer');
			wrapperEl.classList.add('dark-wrapper');

		}else{
			footerEl.classList.remove('dark-footer');
			wrapperEl.classList.remove('dark-wrapper');
		}
		
	 });
	function timer(isTwentyFourHour, timezone) {
	const now = getDateByTimezone(new Date(), timezone);

	//Get seconds, minute, an hours from Date.
	const seconds = now.getSeconds(),
		minutes = now.getMinutes(),
		hours = now.getHours();

	//Make hours either 12 or 24 hour format
	let hours_12 = isTwentyFourHour ? hours : hours % 12 || 12;

	//Make the values always double-digit
	let secondsDbl = ('0' + seconds).slice(-2),
		minutesDbl = ('0' + minutes).slice(-2),
		hoursDbl = ('0' + hours_12).slice(-2);

	//Seperate the two digits of each into an array
	const secondsOutput = [],
		stringNumberSeconds = secondsDbl.toString();

	const minutesOutput = [],
		stringNumberMinutes = minutesDbl.toString();

	const hoursOutput = [],
		stringNumberHours = hoursDbl.toString();

	for (i = 0; i < 2; i++) {
		secondsOutput.push(+stringNumberSeconds.charAt(i));
		minutesOutput.push(+stringNumberMinutes.charAt(i));
		hoursOutput.push(+stringNumberHours.charAt(i));
	}

	for (i = 0; i < 10; i++) {
		for (j = 0; j < 2; j++) {
			numSecondArray[j].classList[(secondsOutput[j] == i) ? 'add' : 'remove']('num' + i);

			numMinuteArray[j].classList[minutesOutput[j] == i ? 'add' : 'remove']('num' + i);

			numHourArray[j].classList[hoursOutput[j] == i ? 'add' : 'remove']('num' + i);
		}
	}

	ampm.innerHTML = now.getHours() < 12 ? 'AM' : 'PM';
}

function getDateByTimezone(date, timeZone) {
	return new Date(date.toLocaleString('en-US', {
		timeZone
	}));
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