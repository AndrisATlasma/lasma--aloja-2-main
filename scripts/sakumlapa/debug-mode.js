// @ts-check

export default function DebugMode() {
  const debugModeButton = document.getElementById('debugModeButton');
  const svgDebugContainer = document.getElementById('Debug_ID');

  gsap.to(svgDebugContainer, {
    duration: 0.25,
    display: 'none',
    opacity: 0,
  });

  debugModeButton.addEventListener('click', function () {
    this.classList.toggle('active');
    const isActive = debugModeButton.classList.contains('active');
    gsap.to(svgDebugContainer, {
      duration: 0.25,
      opacity: isActive ? 1 : 0,
      display: isActive ? 'inline' : 'none',
    });
    gsap.from('#Debug_ID > g', {
      duration: 0.25,
      y: isActive ? -20 : 0,
      stagger: 0.005,
    });
  });
}
