// @ts-check
import { settings, commands, elementConfig } from '../data.js';
import { getStatusText, getStatusClass, getFlowDividerText } from '../text-functions.js';
import ServiceMode from '../service-mode-al1.js';
import { developerMode } from '../developer-mode.js';

const modalContainer = document.querySelector('.modal__container');
const modalTitle = document.getElementById('modal-cntrl-title');
const modalContent = document.getElementById('modal-cntrl-content');
const titleTemplate = Handlebars.compile(modalTitle.innerHTML);
const contentTemplate = Handlebars.compile(modalContent.innerHTML);
var firstTime = true;

export async function refreshModalWindow() {
  const elId = localStorage.getItem('elementId');
  const sqlData = await runSqlSelect('al1_select_all_elements');
  const current = sqlData.find((el) => el.el_id === parseInt(elId));

  console.log(current);
  const attributes = JSON.parse(current.el_attrs);
  const config = elementConfig.find(({ id }) => id === current.el_type);
  const settingsArray = config.settings.map((id) => {
    const setting = settings.find((el) => el.id === id);
    const neededKey = setting.attributeTag ? setting.tag : '_' + setting.tag.replace('_ID', '');
    const value = attributes ? attributes[neededKey] : null;
    const tagBase = developerMode ? 'state' : 'comand';
    const tag = setting.attributeTag ? `${tagBase}_ID${elId}_${setting.tag}` : setting.tag + elId;
    return { ...setting, value, tag };
  });
  for (const setting of settingsArray) {
    if (setting.attributeTag) {
      const sql = await runSqlSelect('al1_select_tag_from_attrs', { tag_name: setting.tag.replace('state', 'comand') });
      if (sql && sql.length) {
        setting.value = setting.tag === 'comand_ID100_FR' ? Math.floor(sql[0].tag_value / 10) : sql[0].tag_value; // Jālabo lai nav cieti definēts
      } else {
        setting.value = null;
      }
    } else if (setting.tag.indexOf('service_interval') !== -1) {
      setting.value = current.service_interval;
    }
  }
  const commandsArray = config.commands.map((id) => commands.find((c) => c.id === id));
  const nextService = current.next_service_after;
  const stateFields = [
    {
      id: 'status',
      label: 'Statuss:',
      value: getStatusText(current),
      class: getStatusClass(current),
    }
  ];
  if (!['silos', 'virtual_silos','scales'].includes(current.el_type)) {
    stateFields.push(
      {
        id: 'maintenance1',
        label: 'Nākamā apkope pēc [st]:',
        value: nextService <= 0 ? 'Nepieciešama tūlīt!' : nextService.toFixed(0),
        class: nextService <= 0 ? 'state-red' : '',
      },
      { id: 'maintenance2', label: 'Motostundas kopā [st]:', value: current.moto_time_h.toFixed(0), class: '' },
    );
  }

  const serviceMode = (current.el_state === 6 && current.el_parts) || current.part_of_el;
  let connectedElements = '';
  let parts = [];
console.log(serviceMode);

  if (serviceMode) {
    console.log(current.el_parts);
    if (current.el_parts) {
      connectedElements = `${current.el_id},${current.el_parts}`;
      console.log('viens elements');
    } else {
      const parent = sqlData.find((el) => el.el_id === current.part_of_el);
      connectedElements = `${parent.el_id},${parent.el_parts}`;
      console.log('vairāki elementi');
    }
    parts = connectedElements.split(',').map((id) => ({
      id,
      name: sqlData.find((el) => el.el_id === parseInt(id)).el_name,
      class: id === elId ? 'active' : '',
    }));
  }
  console.log(parts);

  modalTitle.innerHTML = titleTemplate({ name: current.el_name });
  modalContent.innerHTML = contentTemplate({
    serviceMode,
    settings: settingsArray,
    stateFields,
    commands: commandsArray,
    parts,
  });

  const form = document.getElementById('settings--form');
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('change', function ({ target }) {
      // @ts-ignore
      const { name, value } = target;
      try {
        if (name === 'comand_ID100_FR') {
          const frValue = Math.floor(value) * 10;
          this.value = Math.floor(value).toString();
          setTag(name, frValue);
        } else if (name.indexOf('service_interval') !== -1) {
          const id = parseInt(name.replace('service_interval', ''));
          runSqlUpdate('al1_update_service_interval', { el_id: id, interval: value });
        } else {
          setTag(name, value);
        }
      } catch (e) {
        console.error('Error setting tag:', e);
      }
    });
  });

  if (config.commands.length) {
    const setingsCommands = document.getElementById('settings__commands');
    const buttons = setingsCommands.querySelectorAll('button');
    buttons.forEach((button) => {
      if (current.el_type === 'flow_divider' || current.el_type === 'multi_switch') {
        button.innerHTML = getFlowDividerText(elId, button.dataset.value, button.innerHTML);
      }
      button.addEventListener('click', async function () {
        // @ts-ignore
        const { value } = this.dataset;
        if (value !== 'maintenance' || (value === 'maintenance' && confirm('Vai elementam tika veikta apkope?'))) {
          try {
            if (developerMode) {
              setTag(`state_ID${elId}`, value === '4' ? '6' : value);
            } else {
              if (value === 'maintenance') {
                await runSqlUpdate('al1_update_service_time', { el_id: elId });
              } else {
                setTag(`comand_ID${elId}`, value);
                console.log(elId);
              }
            }
            const text = this.textContent;
            this.disabled = true;
            this.textContent = '...';
            setTimeout(() => {
              this.disabled = false;
              this.textContent = text;
              refreshModalWindow();
            }, 2500);
          } catch (e) {
            console.error('Error setting tag:', e);
          }
        }
      });
    });
  }
  ServiceMode();

  if (modalContainer) {
    const height = modalContainer['offsetHeight'];
    window.resizeTo(500, height + 100);
    if (firstTime) {
      firstTime = false;
      modalContainer['style'].opacity = 1;
    }
  }
}
refreshModalWindow();
