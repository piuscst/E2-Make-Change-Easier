export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const crewSize = 6;
const suppliesPerSupplyWorker = 3;
const defaultSupplyWorkers = 2;

let supplyWorkers = defaultSupplyWorkers;

function drawCrewTiles() {
  for (let i = 0; i < crewSize; i++) {
    const onSupplies = i < supplyWorkers;
    ctx.fillStyle = onSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = onSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function writeReadout(
  production: number,
  consumption: number,
  balance: number,
) {
  readout.textContent =
    `Assigned: ${supplyWorkers}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

function render() {
  const production = supplyWorkers * suppliesPerSupplyWorker;
  const consumption = crewSize;
  const balance = production - consumption;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewTiles();
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${supplyWorkers} / 6`, 18, 76);
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
  writeReadout(production, consumption, balance);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  supplyWorkers = Math.max(0, supplyWorkers - 1);
  render();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  supplyWorkers = Math.min(crewSize, supplyWorkers + 1);
  render();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    supplyWorkers = defaultSupplyWorkers;
    render();
  };
render();
