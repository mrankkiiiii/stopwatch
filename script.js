let timerObject = {
  minutes: 0,
  seconds: 0,
  timerId: 0,
};

function soundAlarm() {
  let amount = 3;
  let audio = new Audio("Timer_Sound_Effect.mp3");
  audio.play();

  for (let i = 0; i < amount; i++) {
    setTimeout(playSound, 1200 * i);
  }
  function playSound() {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
}

function updateValue(key, value) {
  if (value < 0) {
    value = 0;
    console.log("Positive Numbers only");
  }
  if (key == "seconds") {
    if (value < 10) {
      value = "0" + value;
    }
    if (value > 59) {
      value = 59;
    }
  }
  $("#" + key).html(value || 0);
  timerObject[key] = value;
}

(function detectChanges(key) {
  let input = "#" + key + "-input";
  $(input).change(function () {
    updateValue(key, $(input).val());
  });
  $(input).keyup(function () {
    updateValue(key, $(input).val());
  });
  return arguments.callee;
})("minutes")("seconds");

function startTimer() {
  buttonManager(["start", false], ["pause", true], ["stop", true]);
  freezeInputs();

  timerObject.timerId = setInterval(function () {
    timerObject.seconds--;
    if (timerObject.seconds < 0) {
      if (timerObject.minutes == 0) {
        soundAlarm();
        return stopTimer();
      }
      timerObject.seconds = 59;
      timerObject.minutes--;
    }
    updateValue("minutes", timerObject.minutes);
    updateValue("seconds", timerObject.seconds);
  }, 1000);
}
function stopTimer() {
  clearInterval(timerObject.timerId);
  buttonManager(["start", true], ["pause", false], ["stop", false]);
  unFreezeInputs();
  updateValue("minutes", $("minutes-input").val());
  let seconds = $("#seconds-input").val() || "0";
  updateValue("seconds", seconds);
}
function pauseTimer() {
  clearInterval(timerObject.timerId);
  buttonManager(["start", true], ["pause", false], ["stop", true]);
  freezeInputs();
}

function buttonManager(...buttonsArray) {
  for (let i = 0; i < buttonsArray.length; i++) {
    const button = "#" + buttonsArray[i][0] + "-button";
    if (buttonsArray[i][1]) {
      $(button).removeAttr("disabled");
    } else {
      $(button).attr("disabled", "disabled");
    }
  }
}

function freezeInputs() {
  $("#minutes-input").attr("disabled", "disabled");
  $("#seconds-input").attr("disabled", "disabled");
}
function unFreezeInputs() {
  $("#minutes-input").removeAttr("disabled");
  $("#seconds-input").removeAttr("disabled");
}
