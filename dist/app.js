import { initializeNavigation } from './modules/navigation.js';
import { initializeProductPreview } from './modules/product-preview.js';
import { initializeReveal } from './modules/reveal.js';
import { initializeMotion } from './modules/motion.js';

// Static page content remains available if JavaScript is disabled.
initializeNavigation();
initializeProductPreview();
initializeReveal();
initializeMotion();

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
