// variables
let workInterval, workTime, breakTime, breakInterval, tempWorkTime, tempBreakTime;

// ui elements
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');
let timerSection = document.getElementById('timer-section');

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

$("#start").show();
$("#stop").hide();
$("#reset").hide();
$("#timer-section").hide();
$("#break-alert-section").hide();
$("#work-alert-section").hide();

let tablet = "https://cdn.glitch.com/5a0fb168-a5f7-4148-9191-0155af7c10a7%2Ftablet.png?1514007428984";
let television = "https://cdn.glitch.com/5a0fb168-a5f7-4148-9191-0155af7c10a7%2Ftelevision.png?1514007428930";

setTimers(20, 1); // params in minutes

function setTimers(ttime, btime) {
	if (ttime === (workTime / 60) && btime === (breakTime / 60)) {
		console.log("No change in time settings");
	}
	$("#work-time").val(ttime);
	$("#break-time").val(btime);
	workTime = ttime * 60; // in seconds
	breakTime = btime * 60; // in seconds
	console.log("WorkTimer: ", workTime, " BreakTime: ", breakTime);
	// breakTime = btime * 1000 * 60; // in miliseconds
	$("#work-time-value").html(ttime + " minutes");
	$("#break-time-value").html(btime + " minute(s)");
}

function startTimer() {
	$("#start").hide();

	$("#stop").show();
	$("#stop").removeClass("disabled");

	$("#reset").show();
	$("#reset").removeClass("disabled");

	$("#timer-section").show();
	$("#break-alert-section").hide();
	$("#work-alert-section").show();

	notify("*** WORK TIME ***", tablet, 'notify-start', "Wort time is " + (workTime / 60) + " minutes");

	clearInterval(workInterval);
	clearInterval(breakInterval);
	tempWorkTime = workTime;
	workInterval = setTimeout(updateWorkTime, 1000);
}

function updateWorkTime() {
	if (tempWorkTime <= 0) {
		stopTimer();
	} else {
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

	$("#break-alert-section").show();
	$("#work-alert-section").hide();
	notify("*** BREAK TIME ***", television, 'notify-stop', "Relax and go away from computer screen for " + (breakTime / 60) + " minutes");

	$("#stop").hide();
	$("#stop").addClass("disabled");
	$("#reset").show();
	$("#reset").removeClass("disabled");

	timerSection.innerHTML = "";
	clearInterval(workInterval);
	clearInterval(breakInterval);
	tempBreakTime = breakTime;
	breakInterval = setTimeout(updateBreakTime, 1000);
}

function resetTimer() {
	clearInterval(workInterval);
	clearInterval(breakInterval);
	$("#start").show();

	$("#stop").hide();
	$("#stop").addClass("disabled");

	$("#reset").hide();
	$("#reset").addClass("disabled");

	timerSection.innerHTML = "";
	$("#timer-section").hide();
	$("#break-alert-section").hide();
	$("#work-alert-section").hide();
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
	var options = {
		body: theBody,
		icon: theIcon,
	};

	if (!("Notification" in window)) {
		alert("Browser doesn't support notifications");
	}

	else if (Notification.permission === "granted") {
		var notification = new Notification(theTitle, options);
		document.getElementById(theAudio).play();
	}

	else if (Notification.permission !== "granted") {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				var notification = new Notification(theTitle, options);
				document.getElementById(theAudio).play();
			}
		});
	}
}

function storeNewTimer() {
	let inputWorkTime = Number($("#work-time").val());
	let inputBreakTime = Number($("#break-time").val());
	if (inputWorkTime >= 20 && inputBreakTime >= 1) {
		setTimers(inputWorkTime, inputBreakTime);
	}
}

let refresh = document.getElementById('refresh');
refresh.addEventListener('click', function () {
	location.reload();
});

$("#timer-setting").hide();

let timerBtn = document.getElementById('timer-settings-btn');
timerBtn.addEventListener('click', function () {
	document.getElementById("work-time").focus(true);
});

let doneBtn = document.getElementById('done-btn');
doneBtn.addEventListener('click', function () {
	storeNewTimer();
});

let restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', function () {
	storeNewTimer();
	startTimer();
});