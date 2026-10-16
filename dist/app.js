import { initializeNavigation } from './modules/navigation.js';
import { initializeProductPreview } from './modules/product-preview.js';

// Static page content remains available if JavaScript is disabled.
initializeNavigation();
initializeProductPreview();

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
