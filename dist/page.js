import { initializeNavigation } from './modules/navigation.js';
import { initializeReveal } from './modules/reveal.js';
import { initializeMotion } from './modules/motion.js';

// Entry for content pages that do not include the product explorer.
initializeNavigation();
initializeReveal();
initializeMotion();

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
