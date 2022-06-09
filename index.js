'use strict';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const poliLine = document.getElementById('poli');
const poliLine2 = document.getElementById('poli2');
const poliLine3 = document.getElementById('poliCent');
const poliLine4 = document.getElementById('poliCent2');
const thisSvg = document.getElementById('sv');

const audio = document.getElementById('aud');

audio.currentTime = 0;

const audioContext = new AudioContext();

const source = audioContext.createMediaElementSource(audio);
const analyzer = audioContext.createAnalyser();

source.connect(analyzer);
analyzer.connect(audioContext.destination);

let multi = 8;
analyzer.fftSize = 1024 * multi * 2;

const bufferLength = analyzer.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);
let dataArray2 = new Uint8Array(bufferLength);

const lineX = windowWidth / bufferLength;
let lineY = 0;
let timeData = 0;

window.onkeydown = (e) => {
	audioContext.resume();
	if (e.key === ' ') {
		thisSvg.style.backgroundImage = 'url(./nebulaa.jpg)';
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}
	if (e.key === 'z') {
		audio.currentTime += 2;
	}
};

window.onclick = () => {
	audioContext.resume();
	thisSvg.style.backgroundImage = 'url(./nebulaa.jpg)';
	if (audio.paused) {
		audio.play();
	} else {
		audio.pause();
	}
};

function rgba(r, g, b, a) {
	return `rgb(${r}, ${g}, ${b}, ${a})`;
}

let range = Math.trunc(windowWidth / multi) * multi;
if (range === windowWidth) range = windowWidth - multi;

let dotCounter = 0;
function createVisualizer() {
	if (!audio.paused) {
		let points = '';
		let points2 = '';
		let points3 = '';
		let points4 = '';
		let points5 = '';
		const col = 20 / 255;
		analyzer.getByteFrequencyData(dataArray);
		analyzer.getByteTimeDomainData(dataArray2);
		// dataArray = dataArray.reverse();
		for (let i = 0; i < windowWidth; i += multi) {
			if (dataArray[i] !== undefined) lineY = parseInt(dataArray[i] * (windowHeight / 2 / 255));
			if (dataArray2[i] !== undefined) timeData = dataArray2[i] * (windowHeight / 2 / 255);

			points +=
				i !== range
					? `${i},${lineY * -1 + windowHeight / 2} `
					: `${i + 2},${lineY * -1 + windowHeight / 2} ${windowWidth + 2},-2 -2,-2 -2,2`;

			points2 +=
				i !== range
					? `${i},${lineY + windowHeight / 2} `
					: `${i + 2},${lineY + windowHeight / 2} ${windowWidth + 2},${windowHeight + 2} -2,${
							windowHeight + 2
					  } -2,${windowHeight / 2 + 2}`;

			points3 += `${i},${lineY * -1 + Math.trunc(Math.random() * 15) + windowHeight / 2 - 10} `;
			points4 += `${i},${lineY + Math.trunc(Math.random() * 15) + windowHeight / 2 + 5} `;

			thisSvg.style.opacity = lineY * (1 / 255) + 1;

			document.body.style.backgroundColor = rgba(lineY * col, lineY * col, lineY * col, 0.9);
			poliLine.style.fill = rgba(lineY * col, lineY * col, lineY * col, 1);
			poliLine.style.filter = `drop-shadow(0 0 ${lineY / 18}px rgb(63, 102, 231))`;

			poliLine2.style.fill = rgba(lineY * col, lineY * col, lineY * col, 0.9);
			poliLine2.style.filter = `drop-shadow(0 0 ${lineY / 18}px rgb(63, 102, 231))`;
			thisSvg.style.backgroundSize = `calc(100% + ${lineY}px)`;

			if (lineY + windowHeight / 2 === windowHeight / 2) {
				if (dotCounter < 30) {
					const dot = document.createElement('div');
					dot.classList.add('dot');
					dot.id = `dot${Math.trunc(Math.random() * 10000)}`;
					dot.style.left = `${i}px`;
					dot.style.top = `${lineY + windowHeight / 2}px`;
					document.body.insertAdjacentElement('afterbegin', dot);
					animateElem(dot.id);
					dotCounter++;
				}
			}
		}
		poliLine.setAttribute('points', points);
		poliLine2.setAttribute('points', points2);
		poliLine3.setAttribute('points', points3);
		poliLine4.setAttribute('points', points4);
		const newArr = [...new Set(dataArray)];
		for (let i = 0; i < newArr.length; i++) {
			if (newArr[i] > 244) {
				// poliLine.style.fill = rgba(
				// 	0,
				// 	newArr[i] - Math.trunc(Math.random() * (160 - 160) + 150),
				// 	newArr[i] - Math.trunc(Math.random() * (160 - 160) + 150),
				// 	0.8,
				// );
				// poliLine2.style.fill = rgba(0, newArr[i] - Math.trunc(Math.random() * 180), newArr[i] - 130, 0.8);
				poliLine.style.filter = `drop-shadow(0 0 ${newArr[i]}px red)`;
				// poliLine2.style.filter = `drop-shadow(0 0 ${newArr[i]}px yellow)`;
			}
		}
	}

	requestAnimationFrame(createVisualizer);
}

createVisualizer();

function animateElem(elemId) {
	let c = 1;
	let w = 10;
	let m = Math.trunc((Math.random() - 0.5) * 10);
	let m2 = Math.trunc((Math.random() - 0.5) * 10);
	const temp = document.getElementById(elemId);
	let lft = parseInt(getComputedStyle(temp).getPropertyValue('left'));
	let tp = parseInt(getComputedStyle(temp).getPropertyValue('top'));
	const anim = setInterval(() => {
		c -= 0.01;
		w += 0.1;
		lft += m;
		tp += m2;
		temp.style.opacity = c;
		temp.style.width = `${w}px`;
		temp.style.height = `${w}px`;
		temp.style.left = `${lft - w / 2}px`;
		temp.style.top = `${tp - w / 2}px`;
		if (c <= 0) {
			temp.remove();
			clearInterval(anim);
			dotCounter--;
		}
	}, 10);
}
