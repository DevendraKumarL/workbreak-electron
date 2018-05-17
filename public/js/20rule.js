// variables
let workInterval, workTime, breakTime, breakInterval, tempWorkTime;

// ui elements
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let timerSection = document.getElementById('timer-section');

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);

$("#start").show();
$("#stop").hide();
$("#timer-section").hide();

let tablet = "https://cdn.glitch.com/5a0fb168-a5f7-4148-9191-0155af7c10a7%2Ftablet.png?1514007428984";
let television = "https://cdn.glitch.com/5a0fb168-a5f7-4148-9191-0155af7c10a7%2Ftelevision.png?1514007428930";

setTimers(20, 1); // params in minutes

function setTimers(ttime, btime) {
  workTime = ttime * 60; // in seconds
  breakTime = btime * 1000 * 60; // in miliseconds
  if (ttime === workTime && btime === breakTime) {
    return;
  }
  $("#work-time-value").html(ttime + " minutes");
  $("#break-time-value").html(btime + " minute(s)");
}

function startTimer() {
	$("#start").hide();
	$("#stop").show();
	$("#stop").removeClass("disabled");
	$("#timer-section").show();
	
	notify("Keep on Working ...", tablet, 'notify-start', "Go on, Work Now");

  tempWorkTime = workTime;
  clearInterval(workInterval);
	workInterval = setTimeout(updateSecond, 1000);
}

function updateSecond() {
	if (tempWorkTime <= 0) {
		stopTimer();
	} else {
		tempWorkTime -= 1;
		displayTime2(tempWorkTime);
		workInterval = setTimeout(updateSecond, 1000);
	}
}

function displayTime2(currentTime) {
	timerSection.innerHTML = currentTime <= 0 ? "0" + currentTime : currentTime;

	let currentMinute = Math.floor(currentTime / 60);
	let currentSecond = currentTime - currentMinute * 60;
	timerSection.innerHTML =
    (currentMinute <= 9 ? "0" + currentMinute + " : " : currentMinute + " : ") +
    (currentSecond <= 9 ? "0" + currentSecond : currentSecond);
}

function stopTimer() {
	clearInterval(workInterval);

	document.getElementById('timer-section').innerHTML = "Take a break";
	notify("Relax", television, 'notify-stop', "Come back in sometime");

	$("#stop").hide();
	$("#stop").addClass("disabled");

	breakInterval = setTimeout(startTimer, breakTime);
}

function disableTimer() {
	location.reload();
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
		body : theBody,
		icon : theIcon,
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

let timerBtn = document.getElementById('show-timer-btn');
timerBtn.addEventListener('click', function() {
  $("#show-timer-btn").hide();
  $("#timer-setting").show();
  refresh.setAttribute("style", "margin-bottom: 10px; margin-left: 315px; position: fixed; bottom: 0;");
});

let doneBtn = document.getElementById('done-btn');
doneBtn.addEventListener('click', function() {
  $("#timer-setting").hide();
  $("#show-timer-btn").show();
  refresh.setAttribute("style", "margin-bottom: 5px; margin-left: 115px; position: fixed; bottom: 0;");
  storeNewTimer();
});