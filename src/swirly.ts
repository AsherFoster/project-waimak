export interface SwirlifyArgs {
  el: HTMLCanvasElement;
  color?: string;
  mouseInteraction?: boolean;
  size?: number;
  padding?: number;
}

function swirly({
                  el: canvas,
                  color = '#000',
                  mouseInteraction = false,
                  size = 25,
                  padding = 15
                }: SwirlifyArgs) {
  const rotationFactor = 2;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (!ctx) throw Error('Failed to create canvas context');

  let height: number;
  let width: number;
  let rows: number;
  let cols: number;
  let offsetX: number;
  let offsetY: number;
  let mouseX = -Infinity;
  let mouseY = -Infinity; // Just stick it offscreen initially
  let maxDist;

  function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;

    for (let row = 0; row < rows; row++) {
      const y = padding + (size + padding) * row;
      for (let col = 0; col < cols; col++) {
        const x = padding + (size + padding) * col;
        renderLine(x + offsetX, y + offsetY);
      }
    }
  }
  function renderLine(x: number, y: number) {
    const dist = Math.max(Math.sqrt((width - x) ** 2 + (height - y) ** 2) - 100, 30);
    let rot = rotationFactor - (rotationFactor * Math.log(dist) / Math.log(width));
    if (mouseInteraction) {
      const mouseDist = Math.min(Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2), 200);
      rot += mouseDist / 400 - 0.5;
    }
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(Math.PI * rot);
    ctx.fillRect(0, 0, size, size / 10);
    ctx.fill();
    ctx.rotate(Math.PI * -rot);
    ctx.translate(-x, -y);
  }
  function calcLayout() {
    // The canvas size should be it's visual size
    const docHeight = canvas.height = canvas.offsetHeight;
    const docWidth = canvas.width = canvas.offsetWidth;
    rows = Math.ceil(docHeight / (padding + size));
    cols = Math.ceil(docWidth / (padding + size)) + 1;
    height = rows * (size + padding);
    width = cols * (size + padding);
    offsetX = (docWidth - width) / 2;
    offsetY = (docHeight - height) / 2;

    maxDist = Math.sqrt(width ** 2 + height ** 2);

    render();
  }

  window.addEventListener('resize', calcLayout);
  if (mouseInteraction) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.pageX;
      mouseY = e.pageY;
      requestAnimationFrame(render);
    });
  }

  calcLayout();
  render();
}

export default swirly;
