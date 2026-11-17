// Becak Rush input: keyboard state + mouse clicks mapped to canvas coords.
export function createInput(canvas) {
  const keys = {};
  const input = {
    left: false, right: false, up: false, down: false,
    honkPressed: false, clickX: 0, clickY: 0, clicked: false,
    mouseX: 0, mouseY: 0, mouseDown: false,
  };

  function refresh() {
    input.left = keys['arrowleft'] || keys['a'] || false;
    input.right = keys['arrowright'] || keys['d'] || false;
    input.up = keys['arrowup'] || keys['w'] || false;
    input.down = keys['arrowdown'] || keys['s'] || false;
  }

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    keys[k] = true;
    if (k === ' ') { input.honkPressed = true; e.preventDefault(); }
    if (['arrowleft','arrowright','arrowup','arrowdown',' '].includes(k)) e.preventDefault();
    refresh();
    if (input.onKey) input.onKey(k);
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    refresh();
  });

  function toCanvas(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (1280 / r.width),
      y: (e.clientY - r.top) * (720 / r.height),
    };
  }

  canvas.addEventListener('mousemove', (e) => {
    const p = toCanvas(e);
    input.mouseX = p.x; input.mouseY = p.y;
  });
  canvas.addEventListener('mousedown', (e) => {
    const p = toCanvas(e);
    input.mouseDown = true; input.clickX = p.x; input.clickY = p.y; input.clicked = true;
  });
  window.addEventListener('mouseup', () => { input.mouseDown = false; });
  input.consumeClick = () => { const c = input.clicked; input.clicked = false; return c; };
  input.onKey = null;
  return input;
}

export function hitButton(input, x, y, w, h) {
  if (!input.consumeClick()) return false;
  return input.clickX >= x && input.clickX <= x + w && input.clickY >= y && input.clickY <= y + h;
}
