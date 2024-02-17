const formEl = document.forms.settings;
const randomBtnEl = document.getElementById('randombtn');
const peopleLeftEl = document.getElementById('peopleleft');
const settingsEl = document.getElementById('settings');
const randomButtonCont = document.getElementById('randombtncont');
const flushSound = new Audio('sound/toilet-flush-3.wav');
const doorLockSound = new Audio('sound/door-lock-1.wav');
const sinkSound = new Audio('sound/sink-faucet.mp3');
const accidentSound = new Audio('sound/wildcard-accident.mp3');

peopleLeftEl.style.color = "#0f62fe";

const lineSimulator = (arrayWithPeople, arrayWithStalls) => {

  alert('You\'re in the line. Click \'OK\' to start :)')
  timeStart();
  peopleLeftEl.innerHTML = `People left = ${arrayWithPeople.length}`;

  setTimeout(() => { wildCard(arrayWithPeople, arrayWithStalls) }, 300000);

  const interval = setInterval(() => {
    let freeStall = arrayWithStalls.find(element => element.isFree);

    if (freeStall) {
      freeStall.isFree = false;

      if (arrayWithPeople.length === 0) {
        setTimeout(() => { alert(`You can go now <3`) }, 1000);
        setTimeout(() => { location.reload() }, 5000);
        timeReset()
        peopleLeftEl.innerHTML = ``;
        clearInterval(interval);
        return;
      }

      setTimeout(() => { sound() }, arrayWithPeople[ 0 ].timeInside - 23000);
      setTimeout(() => { freeStall.isFree = true }, arrayWithPeople[ 0 ].timeInside);

      arrayWithPeople.shift();

      arrayWithPeople.length !== 0 ?
        peopleLeftEl.innerHTML = `People left: ${arrayWithPeople.length}` : peopleLeftEl.innerHTML = `You're next!`;

      settingsEl.innerHTML = ``;
      randomButtonCont.innerHTML = ``;

      arrayWithStalls.map(element => {
        settingsEl.innerHTML += `<img src="door.png" style="display:inline; height:40px;">`
      });

      arrayWithPeople.map(element => {
        settingsEl.innerHTML += `<img src="female.png" style="display:inline; height:40px;">`
      });

      console.log(arrayWithPeople);
    }
  }, 300);

  setInterval(() => {
    arrayWithPeople.map(person => person.bladder += 1);
  }, 30000);
}

function sound() {
  flushSound.play();
  setTimeout(() => { sinkSound.play() }, 11000);
  setTimeout(() => { doorLockSound.play() }, 22000);
}

const randomizer = (min, max, isForTime) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (isForTime) return Math.floor(Math.random() * (max - min + 1) + min) * 60000;
  else return Math.floor(Math.random() * (max - min + 1) + min)
}

const wildCard = async (arrayWithPeople, arrayWithStalls) => {
  if (randomizer(1, 5) === randomizer(1, 5)) {

    let accidentNumber = randomizer(1, 4);
    accidentSound.play();

    switch (accidentNumber) {

      case 1: {
        setTimeout(() => { alert(`Suddenly a girl who was just behind you storms off to the start of the line and desperately asks to let her go next. The people in the line reluctantly agreed.`) }, 1000);
        arrayWithPeople.unshift(new Person(0, 0, 180000, 97));

        randomButtonCont.innerHTML = ``;
        arrayWithPeople.map(element => {
          randomButtonCont.innerHTML += `<i class="fas fa-female fa-3x"></i>`;
        });

        arrayWithPeople.length !== 0 ?
          peopleLeftEl.innerHTML = `People left: ${arrayWithPeople.length}` : peopleLeftEl.innerHTML = `You're next!`;

        console.log(arrayWithPeople);
        break;
      }

      case 2: {
        setTimeout(() => { alert(`Cleaning staff comes in. It looks like one of the stalls won't be available for another 10 minutes.`) }, 1000);
        arrayWithPeople.unshift(new Person(0, 0, 600000, 20));
        break;
      }

      case 3: {
        if (arrayWithStalls.length > 1) {
          setTimeout(() => { alert(`It looks like the pipe broke down. One of the stalls won't be available in the nearest future. Sorry for the inconvenience!`) }, 1000);
          arrayWithStalls.pop();

          settingsEl.innerHTML = ``;
          arrayWithStalls.map(element => {
            settingsEl.innerHTML += `<i class="fas fa-door-closed fa-2x"></i>`;
          });
        }
      }

      case 4: {
        setTimeout(() => { alert(`Suddenly you realized how thirsty you are. Luckily you had a 0.5L bottle of water with you, and you didn't hesitate to empty the half of it <3`) }, 1000);
      }
    }
  }
}

formEl.addEventListener('submit', async (ev) => {
  ev.preventDefault();

  let min = ev.target.from.value;
  let max = ev.target.to.value;
  let lineCounter = ev.target.linenumber.value;
  let stallNumber = ev.target.stallnumber.value;

  if (min == '' || max == '' || lineCounter == '' || stallNumber == '') {
    alert('Please either fill in the whole form or use the \'random settings\' option :)');
    return;
  }

  if (min < 1 || max < 1 || lineCounter < 1 || stallNumber < 1) {
    alert('The values should be more than zero.');
    return;
  }

  if (min > max) {
    alert(`"From" value should be greater than or equal to "To" value.`);
    return;
  }

  let arrayWithPeople = createPeople(lineCounter, min, max);
  let arrayWithStalls = createStalls(stallNumber);

  lineSimulator(arrayWithPeople, arrayWithStalls);
})

randomBtnEl.addEventListener('click', async () => {
  let peopleCounter = randomizer(5, 15);
  let fromTime = randomizer(1, 1);
  let toTime = randomizer(5, 5);
  let stallNumber = randomizer(1, 5);
  let arrayWithPeople = createPeople(peopleCounter, fromTime, toTime);
  let arrayWithStalls = createStalls(stallNumber);
  lineSimulator(arrayWithPeople, arrayWithStalls);
})
// STOPWATCH

const watch = document.querySelector("#stopwatch");
watch.style.color = "#0f62fe";

let millisecond = 0;
let timer;

function timeStart() {
  clearInterval(timer);
  let start = Date.now()
  timer = setInterval(() => {
    millisecond += 10;

    let dateTimer = new Date();
    dateTimer.setTime(Date.now() - start);

    watch.innerHTML =
      ('0' + dateTimer.getUTCHours()).slice(-2) + ':' +
      ('0' + dateTimer.getUTCMinutes()).slice(-2) + ':' +
      ('0' + dateTimer.getUTCSeconds()).slice(-2);
  }, 10);
}

function timeReset() {
  clearInterval(timer)
  watch.innerHTML = "00:00:00";
}

class Person {
  constructor(position, willEnterAt, timeInside, bladder) {
    this.position = position;
    this.willEnterAt = willEnterAt;
    this.timeInside = timeInside;
    this.bladder = bladder;
  }

  askToCutInLine() {

  }
}

class Stall {
  constructor(isFree) {
    this.isFree = true;
  }
}


function createPeople(lineCounter, fromTime, toTime) {

  let willEnterAt = Date.now();
  let arrayWithPeople = [];

  for (let i = 0; i < lineCounter; i++) {
    if (i !== 0) {
      willEnterAt += arrayWithPeople[ i - 1 ].timeInside;
    }
    let timeInside = randomizer(fromTime, toTime, true);
    let bladder = randomizer(20, 90);

    arrayWithPeople.push(new Person(i, willEnterAt, timeInside, bladder));
  }

  return arrayWithPeople;
}

function createStalls(stallNumber) {

  let arrayWithStalls = [];

  for (let i = 0; i < stallNumber; i++) {
    arrayWithStalls.push(new Stall(true));
  }

  return arrayWithStalls;
}
