const Bacon = window.Bacon;

// Initialize canvas.
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
let infiniteX = Infinity;
let infiniteY = Infinity;
let colorHue = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 70;

// Initialize event streams.
const pointerDownStream = Bacon.fromEvent(document, 'pointerdown');
const pointerMoveStream = Bacon.fromEvent(document, 'pointermove');
const pointerUpStream = Bacon.fromEvent(document, 'pointerup');

const drawingStream = pointerDownStream.flatMap(pointerDownEvent => {
  return pointerMoveStream.takeUntil(pointerUpStream);
});

// Subscription callback.
drawingStream.onValue(pointerMoveEvent => {
  const { clientX, clientY } = pointerMoveEvent;

  ctx.strokeStyle = `hsl(${colorHue}, 100%, 60%)`;
  ctx.beginPath();

  if (Math.abs(infiniteX - clientX) < 100 && Math.abs(infiniteY - clientY) < 100) {
    ctx.moveTo(infiniteX, infiniteY);
  }

  ctx.lineTo(clientX, clientY);
  ctx.stroke();

  infiniteX = clientX;
  infiniteY = clientY;
  colorHue++;
});
