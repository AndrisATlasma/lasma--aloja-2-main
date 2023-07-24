// @ts-check
import { refreshModalWindow } from "./modal/index-al3.js";

export default function ServiceMode() {
  const tabs = document.getElementById('service-mode-tabs');
  if (tabs) {
    const buttons = tabs.querySelectorAll('button');
    buttons.forEach((button) => {
      button.addEventListener('click', function () {
        const { id } = this.dataset;
        localStorage.setItem('elementId', id);
        refreshModalWindow();
      });
    });
  }

}
