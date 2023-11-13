// @ts-check
import { setSqlData, getSqlData, stateColors, silosStateColors, indicatorColors } from './data.js';

var svgUpdateActive = 0;
export function isUpdating() {
  return svgUpdateActive !== 0;
}
export function getSvgUpdateActive() {
  return svgUpdateActive;
}
export function setSvgUpdateActive(value) {
  svgUpdateActive = value;
}

function showMessage(ErrTag) {
  const messageModule = document.querySelector("#message-module");
  const messageText = document.querySelector("#message-text");
  const dropErrBtn = document.getElementById('DropErr');
  const closeButton = document.querySelector("#close-button");
  dropErrBtn.setAttribute('data-tag',ErrTag)
 
  messageText.innerHTML = "Nostrādāja ESTOP";
  // @ts-ignore
  messageModule.style.display = "flex";
  closeButton.addEventListener("click", function () {
      // @ts-ignore
      messageModule.style.display = "none";
  });
}

export const updateElements = (el_id, el_type, el_state, el_attrs) => {
  const state = parseInt(el_state || 0);
  // Element color change
  const pathName = `path_id${el_id}`;
  const element = document.getElementById(pathName);
  if (element) {
   // console.log(element);
    if (['silos', 'virtual_silos'].includes(el_type)) {
      element.style.color = silosStateColors[state];
      const indicator = document.getElementById(`ID${el_id}_full`); 
      //console.log(state);
      indicator.style.display = state === 4 ? 'inline' : 'none';
    } else {
      element.style.color = stateColors[state];
    }
  } else {
    // Element switch positon change
    const allSwitchPositions = document.querySelectorAll(
      `[id^="sw${el_id}_s"]`,
    );
    if (allSwitchPositions.length) {
      allSwitchPositions.forEach((switchPosition) => {
        switchPosition['style'].display = switchPosition.id.endsWith(`${state}`)
          ? 'inline'
          : 'none';
      });
    }
  }
  // Element attributes change
 
  if (el_attrs) {
    //console.log(el_attrs);
    const attrs = JSON.parse(el_attrs);
    
    for (const attr in attrs) {
     //console.log(attr);
      //console.log(el_id);
      const element = document.getElementById(`ID${el_id}_${attr}`);
      //console.log(element);
      if (element) {
        var value = ['FR', 'A'].includes(attr)
        

          ? parseFloat(attrs[attr] || 0).toFixed(1)
          : attrs[attr];
        if (attr === 'LVL') {
          value = (parseInt(attrs[attr] || 0) / 1000).toFixed(2);
          
        }
        if (attr === 'PRO') {
          value = (parseInt(attrs[attr] || 0)).toFixed(1);
          
        }
        if (attr === 'weight') {
          value = parseInt(attrs[attr] || 0);
        }
        if (attr === 'weight_h') {
          value = parseInt(attrs[attr] || 0);
        }
        if (attr === 'presure') {
          
          value = parseFloat(attrs[attr] || 0).toFixed(1);
          
        }
        if(attr ==='HL'){
          //console.log(attrs[attr]);
          
          
          element.style.color = indicatorColors[attrs[attr]];
          
          
        }
        if(attr === 'LL'){
          //console.log(attrs[attr]);
          element.style.color = indicatorColors[attrs[attr]];
         
          
        }
        element.innerHTML = value;
      }
    }
  }
};

export default async function updateSVG(id = null, value = null) {

  
  if (window.parent.location.href.indexOf('page-sakums.html') !== -1) {
    
    if(getTag("P2_ESTOP")=== true) showMessage('ResetErr');
    const data = !id
      ? await runSqlSelect('al2_select_all_elements')
      : [{ el_id: id, el_state: value }];
    if (!id) {
      //console.log(data);
      setSqlData(data);
    } else {
      const sqlData = getSqlData();
      
      
      const index = sqlData.findIndex((el) => el.el_id === parseInt(id));
      if (index !== -1) {
        sqlData[index].el_state = value;
      }
      
    }
    
    data.forEach(({ el_id, el_type, el_state, el_attrs }) => {
      updateElements(el_id, el_type, el_state, el_attrs);
    });
  }else if(window.parent.location.href.indexOf('al3-sakums.html') !== -1){
    if(getTag("P3_ESTOP") === true) showMessage('Part3_RESET_EL');
    const data = !id
    ? await runSqlSelect('al3_select_all_elements')
    : [{ el_id: id, el_state: value }];
  if (!id) {
    
    setSqlData(data);
  } else {
    const sqlData = getSqlData();
    //console.log(sqlData);
    const index = sqlData.findIndex((el) => el.el_id === parseInt(id));
    if (index !== -1) {
      sqlData[index].el_state = value;
    }
  }
  data.forEach(({ el_id, el_type, el_state, el_attrs }) => {    
    updateElements(el_id, el_type, el_state, el_attrs);
  });
  }else if(window.parent.location.href.indexOf('al1-sakums.html') !== -1){
    //console.log("a1-sakums svg ipdate cikls");
    //console.log(getTag("ESTOP"));

    


    if(getTag("P1_ESTOP")=== true) showMessage('Part1_ErrReset');
    const data = !id
    ? await runSqlSelect('al1_select_all_elements')
    : [{ el_id: id, el_state: value }];
  if (!id) {
    //console.log(data);
    setSqlData(data);
  } else {
    
    const sqlData = getSqlData();
    //console.log(sqlData);
    const index = sqlData.findIndex((el) => el.el_id === parseInt(id));
    if (index !== -1) {
      sqlData[index].el_state = value;
    }
  }
  data.forEach(({ el_id, el_type, el_state, el_attrs }) => {    
    updateElements(el_id, el_type, el_state, el_attrs);
  });
  }
  svgUpdateActive = setTimeout(updateSVG, !id ? 2000 : 2500);
}

