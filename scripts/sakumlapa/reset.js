// @ts-check

export default function Reset() {
  const errorResetButtons = document.querySelectorAll('.tag-button');
  errorResetButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const tag = this.dataset.tag;
      const confirmMessage = this.dataset.confirm;
      if (confirm(confirmMessage)) {
        setTag(tag, true);
        
      }
    });
  });

  const resetWeightButton = document.getElementById('weightReset');
  if (resetWeightButton) {
    resetWeightButton.addEventListener('click', function () {
      if (confirm('Vai vēlaties nonullēt “ES” svaru?')) {
        setTag('Part2_WeightComand', 2);
      }
    });
  }
}
