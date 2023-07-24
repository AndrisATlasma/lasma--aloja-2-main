// @ts-check
import DebugMode from './debug-mode.js';
import Routes from './routes.js';
import UpdateSVG from './update-svg.js';
import ModalWindow from './modal-window.js';
import { developerMode } from './developer-mode.js';
import Reset from './reset.js';

DebugMode();
Routes();
UpdateSVG();
ModalWindow();
Reset();

if (developerMode) {
  console.warn('Developer mode is on!');
}