import gsap from 'gsap';
import './style.css'


import SmoothScroll from './utils/SmoothScroll';
import SequenceController from './utils/SequenceController';


const progressBar = document.querySelector('.scroll-hud-bar');

const canvas = document.querySelector(".story-video");


const seq = new SequenceController({
    canvas,
    frameCount: 100,
    preload: true,
    transition: true,       // toggle effect
    transitionSpeed: 0.15   // tweak feel
});


const scroll = new SmoothScroll({
    container: ".scroll-container",
    ease: 0.08,
    minStep: 1.6,
    onScroll: ({ progress }) => {
        gsap.set(progressBar, { scaleX: progress, });
        seq.setProgress(progress);
        console.log(progress);
    },
});
