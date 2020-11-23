"use strict";

const colors = ['#FF6B00', '#BC0022', '#940CFE', '#FBFF00', '#35D073', '#1EC9E8'];
const times = document.querySelector('#times');
const points = document.querySelector('#points');
const create = document.querySelector('#newgame');
const start = document.querySelector('#start');
const bord = document.querySelector('.bord');
const boxs = document.querySelectorAll('.box');
create.addEventListener('click', gameInit);
start.addEventListener('click', gameStart);

const game = {
  new: true,
  started: false,
  points: 0
};

const timer = new Tock({
  countdown: true,
  interval: 1000,
  callback: gameStep,
  complete: timeOver
});

gameInit();

function gameInit() {
  game.points = 0;
  game.time = 60;
  times.innerHTML = game.time;
  points.innerHTML = game.points;

  if (!game.new) {
    timer.stop();
    timer.reset();
    game.new = true;
    start.innerHTML = 'Start';
    start.disabled = false;
    bord.dataset.lock = 'false';
  }

  boxs.forEach(box => {
    box.style.backgroundColor = 'white';
    box.dataset.active = 'false';
  });
}

function gameStart() {
  if (game.new) {
    game.new = false;
    start.innerHTML = 'Pause';
    bord.dataset.lock = 'false';
    timer.start(60000);
    return;

  } else if (start.innerHTML === 'Continue') {
    start.innerHTML = 'Pause';
    bord.dataset.lock = 'false';

  } else {
    start.innerHTML = 'Continue';
    bord.dataset.lock = 'true';
  }

  timer.pause();
}

function gameStep() {
  times.innerHTML = game.time--;
  let num = getRandom(3);
  activateBox(num);
}

function activateBox(num) {
  let unActive = [].filter.call(boxs, box => box.dataset.active === 'false');

  if (unActive.length>0) {
    for (let i = num; i>0; i--) {
      let box = unActive[getRandom(unActive.length)];
      box.dataset.active = 'true';
      box.style.backgroundColor = colors[getRandom(colors.length)];
      box.addEventListener('click', shot);

      function shot() {
        points.innerHTML = ++game.points;
        box.dataset.active = 'false';
        box.style.backgroundColor = 'white';
        box.removeEventListener('click', shot);
      }
    }
  }
}

function timeOver() {
  start.disabled = true;
  bord.dataset.lock = 'true';
  let save = document.querySelector('#save');
  let name = document.querySelector('#name');
  let points = document.querySelector('#respoints');
  save.addEventListener('click', writeResult);
  points.innerHTML = game.points;

  $('#modal').modal("show");

  function writeResult() {
    let results = document.querySelector('#results');
    let div = document.createElement('div');
    div.className = "result__item";
    div.innerHTML = `<strong class='name'>${name.value}</strong>${game.points}`;
    results.append(div);

    $('#modal').modal('hide');
    name.value = '';
    save.removeEventListener('click', writeResult);
  }
}

function getRandom(upTo) {
  return Math.floor(Math.random() * upTo);
}