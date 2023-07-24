// @ts-check

var sqlData = [];
export const setSqlData = (data) => {
  sqlData = data;
};
export const getSqlData = () => sqlData;

var routesData = [];
export const setRoutesData = (data) => {
  routesData = data;
};
export const getRoutesData = () => routesData;

export const routesDataDiffers = (data) => {
  if (data.length !== routesData.length) {
    return true;
  }
  return JSON.stringify(data) !== JSON.stringify(routesData);
};

var selectedRoute = null;
export const setSelectedRoute = (id) => {
  selectedRoute = parseInt(id);
};
export const getSelectedRoute = () => selectedRoute;

export const colors = {
  gray: '#BBBBBB',
  green: '#209E25',
  yellow: '#BCB734',
  red: '#EB5555',
  blue: '#2604AE',
  darkGray: '#686868',
  orange: '#FFA500',
};

export const routeColors = [
  colors.darkGray,
  colors.yellow,
  null,
  colors.yellow,
  colors.orange,
  colors.red,
]

export const stateColors = [
  colors.gray,
  colors.gray,
  colors.green,
  colors.green,
  colors.yellow,
  colors.red,
  colors.yellow,
];

export const indicatorColors = {
  false: colors.gray,
  true: colors.red,
  
}

export const silosStateColors = [
  colors.gray,
  colors.gray,
  colors.green,
  colors.green,
  colors.yellow,
  colors.red,
];

export const commands = [
  { id: 1, label: 'Izslēgt', value: '1', class: 'stop' },
  { id: 2, label: 'Ieslēgt', value: '2', class: 'start' },
  { id: 3, label: 'Ciet', value: '1', class: 'stop' },
  { id: 4, label: 'Vaļā', value: '2', class: 'start' },
  { id: 5, label: 'Uz ?', value: '1', class: 'start' },
  { id: 6, label: 'Uz ?', value: '2', class: 'start' },
  { id: 7, label: 'Servisa režīms', value: '4', class: 'debug' },
  { id: 8, label: 'Tika veikta apkope', value: 'maintenance', class: 'debug' },
  /////// darvs ar plūsmas vārstiem/////////////
  { id: 9, label: 'Uz ?', value: '2', class:'start'},
  { id: 10, label: 'Uz ?', value: '1', class:'start'},
  { id: 11, label: 'Uz ?', value: '3', class:'start'},
  { id: 12, label: 'Uz ?', value: '4', class:'start'},
  { id: 13, label: 'Atsaistīt produktu', value: '99', class:'start'},
];

export const settings = [
  { id: 1, label: 'Palaišanās laiks [s]:', tag: 'startDelay_ID' },
  { id: 2, label: 'Apstāšanās laiks [s]:', tag: 'stopDelay_ID' },
  { id: 3, label: 'Pārplūdes laiks [s]:', tag: 'ovfDelay_ID' },
  { id: 4, label: 'Ātrums [Hz]:', tag: 'FR', attributeTag: true },
  { id: 5, label: 'Apkope ik pēc [st]:', tag: 'service_interval' },


  { id: 6, label: 'Pilna maisa svaru:', tag: 'SetWeight_ID' },
  { id: 7, label: 'Iestatīt filtrācijas laiku:', tag: 'BagFullDelay_ID' },
  { id: 8, label: 'Tukša maisa svars:', tag: 'EmptyBagWeight_ID' },



  { id: 9, label: 'Parauga ņemšanas laiks:', tag: 'samplingTime_ID'}, // paraugu ņemšanai
  { id: 10, label: 'Pauze starp par. ņemšanas laiku:', tag: 'pauza_ID' },// paraugu ņemšanai

];

export const elementConfig = [
  { id: 'motor', settings: [1, 2, 5], commands: [2, 1, 7, 8] },
  { id: 'motor_with_ovf', settings: [1, 2, 3, 5], commands: [2, 1, 7, 8] },
  { id: 'motor+', settings: [1, 2, 3, 4, 5], commands: [2, 1, 7, 8] },
  { id: 'switch', settings: [1, 2, 5], commands: [4, 3, 8] },
  { id: 'flow_divider', settings: [1, 2, 5], commands: [5, 6, 8] },
  { id: 'silos', settings: [1, 2, 3], commands: [13] },
  { id: 'virtual_silos', settings: [1, 2, 3], commands: [] },
  { id: 'multi', settings: [1, 2, 5], commands: [2, 1, 7, 8] },
  { id: 'scales', settings: [8,6,7], commands: [] },
  { id: 'motor2', settings: [1, 2, 4, 5], commands: [2, 1, 7, 8] },
  { id: 'sample', settings: [9, 10], commands: [4, 3, 8] }, // paraugu ņemšanai
  { id: 'multi_switch', settings: [1,2, 5], commands: [9,10,11,8] }, // testa 3way frow
];
