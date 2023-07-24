// @ts-check
import {
  setRoutesData,
  getRoutesData,
  setSelectedRoute,
  getSelectedRoute,
  routesDataDiffers,
  colors,
  routeColors,
} from './data.js';
import { developerMode } from './developer-mode.js';
import { getRouteStatusText } from './text-functions.js';
import { getRouteStatusColor} from './text-functions.js';

const selectBox = document.querySelector('#route-select');
const startButton = document.querySelector('#startRoute');
const stopButton = document.querySelector('#endRoute');
const showButton = document.querySelector('#showRoute');

const selectTemplate = Handlebars.compile(selectBox.innerHTML);



var previewOn = false;

// Event listeners
selectBox.addEventListener('change', (e) => {
  const routeId = e.target['value'];
  if (routeId !== '-1') {
    const route = getRoutesData().find(
      ({ r_id }) => r_id === parseInt(routeId),
    );
    setSelectedRoute(route.r_id);
    showButton['disabled'] = false;
  } else {
    showButton['disabled'] = true;
  }
  updateButtonStates(routeId);
});

const updateButtonStates = (id) => {
  var disabled = { start: true, stop: true };

  const route = getRoutesData().find(({ r_id }) => (id ? r_id === parseInt(id) : r_id === getSelectedRoute()));
  //console.log(route);
  if(route){
    if(route.r_name.startsWith("CC63")){

      disabled.start = !([0, 4].includes(route.r_state) && route.r_can_be_started === null);
      disabled.stop = false;
    }  else if (route) {

      disabled.start = !([0, 4].includes(route.r_state) && route.r_can_be_started === '1');
      disabled.stop = false;
    }
  }

  startButton['disabled'] = disabled.start;
  stopButton['disabled'] = disabled.stop;
};

const startRoute = (id) => {
  try {
    if (developerMode) {
      console.log('Starting route', id);
      setTag(`routeState_${id}`, 2);

    } else {      
        if (window.parent.location.href.indexOf('page-sakums.html') !== -1){
          setTag(`routeComand_${id}`, 1);
        }else if(window.parent.location.href.indexOf('al3-sakums.html') !== -1){
          setTag(`P3_routeComand_${id}`, 1)
        }else if(window.parent.location.href.indexOf('al-sakums.html') !== -1){
          // šeit būs Kirila lapas pārveidots uz vienotu standartu
        }
    }
  } catch (e) {
    console.error('Error setting tag:', e);
  }
};

const endRoute = (id) => {
  try {
    if (developerMode) {
      console.log('Ending route', id);
      setTag(`routeState_${id}`, 0);
    } else {      
      if (window.parent.location.href.indexOf('page-sakums.html') !== -1){
        setTag(`routeComand_${id}`, 2);
      }else if(window.parent.location.href.indexOf('al3-sakums.html') !== -1){
        setTag(`P3_routeComand_${id}`, 2)
      }else if(window.parent.location.href.indexOf('al-sakums.html') !== -1){
        // šeit būs Kirila lapas pārveidots uz vienotu standartu
      }
  }
  } catch (e) {
    console.error('Error setting tag:', e);
  }
};

const enableButtons = (enabled) => {
  startButton['disabled'] = !enabled;
  stopButton['disabled'] = !enabled;
};

startButton.addEventListener('click', () => {
  enableButtons(false);
  const route = getSelectedRoute();
  if (route !== -1) {
    startRoute(route);
    
  }
  setTimeout(() => {
    updateButtonStates();
  }, 3000);
});

stopButton.addEventListener('click', () => {
  enableButtons(false);
  const route = getSelectedRoute();
  if (route !== -1) {
    endRoute(route);
  }
  setTimeout(() => {
    updateButtonStates();
  }, 3000);
});

function routePreview(on) {
  const selectedRouteId = getSelectedRoute();
  const selectedRoute = getRoutesData().find(({ r_id }) => r_id === selectedRouteId);
  const elemetIds = selectedRoute.r_elements_arr.split(',');
  const arrowIds = selectedRoute.arrows.split(',');
  if (elemetIds.length > 0) {
    document.querySelectorAll('g[id^="path_id"], g[id^="group_id"], #Car, #Vector452, path[id^="arrow__"], [id$="AirLine"]').forEach((el) => {
      const id = /(path|group)_id(\d+)/.exec(el['id']);
      const arrowId = /arrow__(\d+_\d+)/.exec(el['id']);
      if (!on || (id && elemetIds.includes(id[2])) || (arrowId && arrowIds.includes(arrowId[1]))) {
        el['style'].opacity = 1;
      } else {
        el['style'].opacity = 0.2;
      }
    });
  }
  previewOn = on;
}
showButton.addEventListener('mousedown', () => { routePreview(true); });
document.addEventListener('mouseup', () => { if (previewOn) routePreview(false); });

// Main function
export default async function routes() {
  if (window.parent.location.href.indexOf('page-sakums.html') !== -1) {

    const data = await runSqlSelect('al2_select_all_routes');
    if (routesDataDiffers(data)) {
      setRoutesData(data);
      selectBox.innerHTML = selectTemplate({
        routes: data.map(({ r_id, r_name, r_color, r_can_be_started, r_state }) => {


          //console.log(r_name);
          if (r_name.startsWith("CC63")){
            const stateText = getRouteStatusText(r_state, true);
            const stateColor = getRouteStatusColor(r_state, true);
            return {            
              id: r_id,
              name: r_name + (stateText !== '' ? ` (${stateText})` : ''),
              color: stateColor,
            };
          }else{
            const stateText = getRouteStatusText(r_state, r_can_be_started);
            const stateColor = getRouteStatusColor(r_state, r_can_be_started);
          return {            
            id: r_id,
            name: r_name + (stateText !== '' ? ` (${stateText})` : ''),
            color: stateColor,
          };
        }
        }),
      });
      
      const allArrows = document.querySelectorAll('[id^="arrow__"]');
      
      allArrows.forEach((arrow) => {
        if (arrow.getAttribute('fill')) {
          arrow['style'].fill = colors.darkGray;
        } else {
          arrow['style'].stroke = colors.darkGray; 
        }
      });
    }

    const selectedRoute = getSelectedRoute();
    
    if (selectedRoute !== null) {
      selectBox['value'] = selectedRoute;
    } else {
      selectBox['value'] = '-1';
    }
    updateButtonStates();

    data
      .filter(({ r_state }) => r_state !== 0)
      .forEach(({ r_state, arrows, r_color }) => {
        const arrowIds = arrows.split(',');
        arrowIds.forEach((arrowId) => {
          //console.log(arrowId);
          const arrows = document.querySelectorAll(`[id^="arrow__${arrowId}"]`);
          if (arrows.length > 0) {
            arrows.forEach((arrow) => {
              const color = routeColors[r_state] || r_color;
              if (arrow.getAttribute('fill')) {
                arrow['style'].fill = color;
              } else {
                arrow['style'].stroke = color;
              }
            });
          }
        });
      });
  } else if(window.parent.location.href.indexOf('al3-sakums.html') !== -1) {

    const data = await runSqlSelect('al3_select_all_routes');
    
    if (routesDataDiffers(data)) {
      setRoutesData(data);
      selectBox.innerHTML = selectTemplate({
        routes: data.map(({ r_id, r_name, r_color, r_can_be_started, r_state }) => {
          const stateText = getRouteStatusText(r_state, r_can_be_started);
          const stateColor = getRouteStatusColor(r_state, r_can_be_started);
          return {
            id: r_id,
            name: r_name + (stateText !== '' ? ` (${stateText})` : ''),
            color: stateColor,
          };
        }),
      });
      
      const allArrows = document.querySelectorAll('[id^="Arrow_"]');
      
      allArrows.forEach((arrow) => {
        
        if (arrow.getAttribute('fill')) {
          arrow['style'].fill = colors.darkGray;
        } else {
          arrow['style'].stroke = colors.darkGray; 
        }
      });
    }

    const selectedRoute = getSelectedRoute();
    
    if (selectedRoute !== null) {
      selectBox['value'] = selectedRoute;
    } else {
      selectBox['value'] = '-1';
    }
    updateButtonStates();

    data
      .filter(({ r_state }) => r_state !== 0)
      .forEach(({ r_state, arrows, r_color }) => {
        
        const arrowIds = arrows.split(',');
        
        arrowIds.forEach((arrowId) => {
          console.log(arrowId);
          const arrows = document.querySelectorAll(`[id^="Arrow_${arrowId}"]`);
          if (arrows.length > 0) {
            arrows.forEach((arrow) => {
              const color = routeColors[r_state] || r_color;
              if (arrow.getAttribute('fill')) {
                arrow['style'].fill = color;
              } else {
                arrow['style'].stroke = color;
              }
            });
          }
        });
      });
/////////////////////////////////////////////////////  al1   ///////////// apstrāde
  }else if(window.parent.location.href.indexOf('al1-sakums.html') !== -1) {

    const data = await runSqlSelect('al1_select_all_routes');
//console.log(data);
    if (routesDataDiffers(data)) {
      setRoutesData(data);
      selectBox.innerHTML = selectTemplate({
        routes: data.map(({ r_id, r_name, r_color, r_can_be_started, r_state }) => {
          const stateText = getRouteStatusText(r_state, r_can_be_started);
          const stateColor = getRouteStatusColor(r_state, r_can_be_started);
          return {
            id: r_id,
            name: r_name + (stateText !== '' ? ` (${stateText})` : ''),
            color: stateColor,
          };
        }),
      });
      
      const allArrows = document.querySelectorAll('[id^="Arrow_"]');
      
      allArrows.forEach((arrow) => {
      
        if (arrow.getAttribute('fill')) {
          arrow['style'].fill = colors.darkGray;
        } else {
          arrow['style'].stroke = colors.darkGray; 
        }
      });
    }

    const selectedRoute = getSelectedRoute();
    
    if (selectedRoute !== null) {
      selectBox['value'] = selectedRoute;
    } else {
      selectBox['value'] = '-1';
    }
    //updateButtonStates();

    data
      .filter(({ r_state }) => r_state !== 0)
      .forEach(({ r_state, arrows, r_color }) => {
        
        const arrowIds = arrows.split(',');
        
        arrowIds.forEach((arrowId) => {
          //console.log(arrowId);
          const arrows = document.querySelectorAll(`[id^="Arrow_${arrowId}"]`);
          if (arrows.length > 0) {
            arrows.forEach((arrow) => {
              const color = routeColors[r_state] || r_color;
              if (arrow.getAttribute('fill')) {
                arrow['style'].fill = color;
              } else {
                arrow['style'].stroke = color;
              }
            });
          }
        });
      });

  }
  setTimeout(routes, 1000);
}
