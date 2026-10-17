export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

let x = 2;
let y = 2;
let direction = 0;

interface Command {
  label: string;
  execute(): void;
}

interface Direction {
  name: string;
  dx: number;
  dy: number;
}

let pending: Command[] = [];

function renderPending() {
  pendingList.replaceChildren(
    ...pending.map((command) => {
      const item = document.createElement("li");
      item.textContent = command.label;
      return item;
    }),
  );
  queueStatus.textContent = pending.length === 0
    ? "Empty"
    : `${pending.length} pending`;
}

const DIRECTION: readonly Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

function clampToGrid(value: number): number {
  return Math.max(0, Math.min(4, value));
}

function enqueue(command: Command) {
  pending.push(command);
  renderPending();
}

function runPending() {
  const route = pending;
  pending = [];
  route.forEach((command) => command.execute());
  renderPending();
  drawRover();
}

function clearPending() {
  pending = [];
  renderPending();
}

const forwardCommand: Command = {
  label: "Forward",
  execute() {
    const heading = DIRECTION[direction];
    x = clampToGrid(x + heading.dx);
    y = clampToGrid(y + heading.dy);
  },
};

const rightCommand: Command = {
  label: "Right",
  execute() {
    direction = (direction + 1) % DIRECTION.length;
  },
};

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    DIRECTION[direction].name
  }`;
}

const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

runButton.disabled = false;
clearButton.disabled = false;

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueue(forwardCommand);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueue(rightCommand);
};
runButton.onclick = runPending;
clearButton.onclick = clearPending;
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  pending = [];
  renderPending();
  drawRover();
};

renderPending();
drawRover();
