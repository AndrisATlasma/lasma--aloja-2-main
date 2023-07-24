// @ts-check

export function getFlowDividerText(id, state, template) {
  const sw = window.opener.document.getElementById(`sw${id}_s${state}`);
  return sw ? template.replace('?', sw.dataset.to) : template;
}

export function getStatusText({ el_id, el_type, el_state }) {
  const state = parseInt(el_state || 0);
  const makeText = (off, on, x) => [
    '?',
    off,
    on,
    x,
    
    'Pieprasa maršr. apstādināšanu',
    'Kļūda',
    'Ieslēgts servisa režīmā',
  ];
  switch (el_type) {
    case 'switch':
      return makeText('Ciet', 'Vaļā')[state];
    case 'flow_divider':
      return makeText(
        getFlowDividerText(el_id, el_state, 'Uz ?'),
        getFlowDividerText(el_id, el_state, 'Uz ?'),
      )[state];
    case 'multi_switch':
      return makeText(
        getFlowDividerText(el_id, el_state, 'Uz ?'),
        getFlowDividerText(el_id, el_state, 'Uz ?'),
        getFlowDividerText(el_id, el_state, 'Uz ?'),
        
      )[state];  
    case 'silos':
    case 'virtual_silos':
      return makeText('Nav pilns', 'Pilns')[state];
    default:
      return makeText('Izslēgts', 'Ieslēgts')[state];
  }
}

export function getStatusClass({ el_type, el_state }) {
  const state = parseInt(el_state || 0);
  const classes = {
    silos: [
      '',
      'state-green',
      'state-yellow',
      'state-green',
      'state-yellow',
      'state-red',
    ],
    flow_divider: [
      '',
      'state-green',
      'state-green',
      'state-green',
      'state-yellow',
      'state-red',
    ],
    multi_switch: [
      '',
      'state-green',
      'state-green',
      'state-green',
      'state-yellow',
      'state-red',
    ],
    default: [
      '',
      '',
      'state-green',
      'state-green',
      'state-yellow',
      'state-red',
    ],
  };
  switch (el_type) {
    case 'flow_divider':
      return classes.flow_divider[state];
    case 'multi_switch':
      return classes.multi_switch[state];  
    case 'silos':
    case 'virtual_silos':
      return classes.silos[state];
    default:
      return classes.default[state];
  }
}

export function getRouteStatusText(r_state, r_can_be_started) {
  var state = parseInt(r_state || 0);
  if (!r_can_be_started && state === 0) {
    state = 6;
  }
  return ['', 'Notiek palaišana', 'Palaists', 'Notiek apstādināšana', 'Pauzēts', 'Kļūda', 'Bloķēts'][state];
}

export function getRouteStatusColor(r_state, r_can_be_started) {
  var state = parseInt(r_state || 0);
  if (!r_can_be_started && state === 0) {
    state = 6;
  }
  return ['#42FF00', '#42FF00', '#42FF00', '#fff200', '#fff200', '#ff0000', '#ffa200'][state];
}
