const remote = require('electron').remote;
const storage = require("electron-json-storage");

const defaultDataPath = storage.getDefaultDataPath();

// app variables
let workInterval, breakInterval;
let workTime, breakTime, tempWorkTime, tempBreakTime;

// app ui elements
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');
let restartTimerBtn = document.getElementById('restart');
let timerSection = document.getElementById('timer-section');

let tablet = "./public/images/laptop.png";
let television = "./public/images/coffee.png";

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
restartTimerBtn.addEventListener('click', restartTimer);

let defaultWtime = 20, defaultBTime = 1;

init(); // start app with ui elements show/hide

function init() {
	$("#start").show();
	$("#stop").hide();
	$("#reset").hide();
	$("#restart").hide();
	$("#timer-section").hide();

	console.log("defaultDataPath => ", defaultDataPath);

	let wtime, btime;
	storage.getMany(['wtime', 'btime'], (error, data) => {
		if (error) {
			console.log("error! could not load wtime & btime : ", error);
			return;
		}
		wtime = data.wtime.time;
		btime = data.btime.time;
		console.log("wtime : ", wtime);
		console.log("btime : ", btime);
		setTimers(wtime, btime, false);
	});
}

function setTimers(wtime, btime, startTimerClock) {
	if (wtime === (workTime / 60) && btime === (breakTime / 60)) {
		return console.log("No change in timer settings");
	}

	let condition = wtime === undefined || btime === undefined;

	storeTimesInStorage(condition ? defaultWtime : wtime, condition ? defaultBTime : btime).then((times) => {
		console.log("times : ", times);
		updateTimers(times.wtime, times.btime, startTimerClock);
	}, (rejected) => {
		console.log("Something went wrong. Please try again later. rejected : ", rejected);
	});
}

function updateTimers(wtime, btime, startTimerClock) {
	$("#work-time").val(wtime);
	$("#break-time").val(btime);
	$("#wb-time-value").text(wtime + " : " + btime);
	workTime = wtime * 60; // in seconds
	breakTime = btime * 60; // in seconds
	if (startTimerClock) {
		startTimer();
	}
}

function storeTimesInStorage(wtime, btime) {
	storage.set('wtime', { time: wtime }, (error) => {
		if (error) {
			console.log("error! could not save default Wtime : ", error);
			return;
		}
		console.log("%%% stored Wtime %%%");
		storage.set('btime', { time: btime }, (error) => {
			if (error) {
				console.log("error! could not save default Btime : ", error);
				return;
			}
			console.log("%%% stored Btime %%%");
		});
	});
	return new Promise((resolve, reject) => {
		resolve({ wtime: wtime, btime: btime });
	});
}

function startTimer() {
	$("#start").hide();

	$("#stop").show();
	$("#stop").removeClass("disabled");

	$("#reset").show();
	$("#reset").removeClass("disabled");

	$("#restart").show();
	$("#restart").removeClass("disabled");

	$("#timer-section").css('border', '2px solid teal');

	timerSection.innerHTML = "";
	notify("WORK TIME", tablet, 'notify-start', (workTime / 60) + " minutes");

	clearInterval(workInterval);
	clearInterval(breakInterval);
	tempWorkTime = workTime;
	workInterval = setTimeout(updateWorkTime, 1000);
	setTimeout(() => {
		$("#timer-section").show();
	}, 990);
}

function updateWorkTime() {
	if (tempWorkTime <= 0) {
		stopTimer();
	} else {
		$("#timer-section").show();
		tempWorkTime -= 1;
		displayTime(tempWorkTime);
		workInterval = setTimeout(updateWorkTime, 1000);
	}
}

function updateBreakTime() {
	if (tempBreakTime <= 0) {
		startTimer();
	} else {
		tempBreakTime -= 1;
		displayTime(tempBreakTime);
		breakInterval = setTimeout(updateBreakTime, 1000);
	}
}

function displayTime(currentTime) {
	timerSection.innerHTML = currentTime <= 0 ? "0" + currentTime : currentTime;

	let currentMinute = Math.floor(currentTime / 60);
	let currentSecond = currentTime - currentMinute * 60;
	timerSection.innerHTML =
		(currentMinute <= 9 ? "0" + currentMinute + " : " : currentMinute + " : ") +
		(currentSecond <= 9 ? "0" + currentSecond : currentSecond);
}

function stopTimer() {
	clearInterval(workInterval);
	clearInterval(breakInterval);

	notify("BREAK TIME", television, 'notify-stop', (breakTime / 60) + " minutes");

	$("#stop").hide();
	$("#stop").addClass("disabled");
	$("#reset").show();
	$("#reset").removeClass("disabled");
	$("#restart").show();
	$("#restart").removeClass("disabled");

	$("#timer-section").css('border', '2px solid yellow');

	timerSection.innerHTML = "";
	tempBreakTime = breakTime;
	breakInterval = setTimeout(updateBreakTime, 1000);
}

function resetTimer() {
	clearInterval(workInterval);
	clearInterval(breakInterval);
	timerSection.innerHTML = "";

	$("#start").show();
	$("#stop").hide();
	$("#stop").addClass("disabled");
	$("#reset").hide();
	$("#reset").addClass("disabled");
	$("#restart").hide();
	$("#restart").addClass("disabled");

	$("#timer-section").hide();
}

function restartTimer() {
	resetTimer();
	setTimeout(startTimer, 500);
}

document.addEventListener('DOMContentLoaded', requestNotificationPermission);

function requestNotificationPermission() {
	if (Notification.permission !== "granted") {
		Notification.requestPermission().then(function (permission) {
			if (permission !== "granted") {
				$("#main-section").remove();
			}
		})
	}
}

function notify(theBody, theIcon, theAudio, theTitle) {
	let options = {
		body: theBody,
		icon: theIcon,
	};

	if (!("Notification" in window)) {
		alert("Browser doesn't support notifications");
	}

	else if (Notification.permission === "granted") {
		let notification = new Notification(theTitle, options);
		document.getElementById("notify-tone").play();
		const win = remote.getCurrentWindow()
		win.focus();
		win.focus();
	}

	else if (Notification.permission !== "granted") {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				let notification = new Notification(theTitle, options);
				document.getElementById("notify-tone").play();
				const win = remote.getCurrentWindow()
				win.focus();
				win.focus();
			}
		});
	}
}

function storeNewTimer(startTimerClock) {
	let inputWorkTime = Number($("#work-time").val());
	let inputBreakTime = Number($("#break-time").val());
	if (inputWorkTime >= 1 && inputBreakTime >= 1) {
		setTimers(inputWorkTime, inputBreakTime, startTimerClock);
	}
}

let refresh = document.getElementById('refresh');
refresh.addEventListener('click', function () {
	location.reload();
});

$("#timer-setting").hide();

let doneBtn = document.getElementById('done-btn');
doneBtn.addEventListener('click', function () {
	storeNewTimer(false);
});

let restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', function () {
	storeNewTimer(true);
});