// @ts-check

export default function ModalWindow() {
  const elements = document.querySelectorAll(
    '#IMG > g[id^="path_id"], #IMG > g[id^="group_id"], #VM > g[id^="group_id"]',
  );
  elements.forEach((element) => {
    element.addEventListener('click', function () {
      const id = this.id;
      //console.log(id);
      const elId = id.replace('path_id', '').replace('group_id', '');
      localStorage.setItem('elementId', elId);
      if (window.parent.location.href.indexOf('page-sakums.html') !== -1) {


      window.open(
        'page-sakums--modal.html',
        'manual control',
        'width=500,height=800,left=100,top=50',
      );
    }else if(window.parent.location.href.indexOf('al3-sakums.html') !== -1){
      window.open(
        'al3-modal.html',
        'manual control',
        'width=500,height=800,left=100,top=50',
      );
    }
    else if(window.parent.location.href.indexOf('al1-sakums.html') !== -1){
      window.open(
        'al1-modal.html',
        'manual control',
        'width=500,height=800,left=100,top=50',
      );
    }
    });
  });
}
