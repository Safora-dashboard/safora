import { initializeNavigation } from './modules/navigation.js';
import { initializeProductPreview } from './modules/product-preview.js';
import { initializeReveal } from './modules/reveal.js';
import { initializeMotion } from './modules/motion.js';
import { initializeTour } from './modules/tour.js';
import { initializeDemoForm } from './modules/demo-form.js';
import { initializePathGraph } from './modules/path-graph.js';
import { initializeRoleSwitch } from './modules/role-switch.js';

// Static page content remains available if JavaScript is disabled.
initializeNavigation();
const preview = initializeProductPreview();
initializeTour(preview.tabs);
initializeRoleSwitch(preview.tabs);
initializePathGraph();
initializeDemoForm();
initializeReveal();
initializeMotion();

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
