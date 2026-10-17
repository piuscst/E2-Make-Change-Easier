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

interface theShift {
  supplyWorkers: number;
  production: number;
  consumption: number;
  balance: number;
}

function calculateShift(supplyWorkers: number): theShift {
  const production = supplyWorkers * suppliesPerSupplyWorker;
  const consumption = crewSize;

  return {
    supplyWorkers,
    production,
    consumption,
    balance: production - consumption,
  };
}

interface ReportRow {
  label: string;
  color: string;
  valueOf: (shift: theShift) => number;
}

const REPORT_ROWS: readonly ReportRow[] = [
  { label: "Production", color: "#27766b", valueOf: (s) => s.production },
  { label: "Consumption", color: "#a44d23", valueOf: (s) => s.consumption },
];

function drawCrewTiles(shift: theShift) {
  for (let i = 0; i < crewSize; i++) {
    const onSupplies = i < shift.supplyWorkers;
    ctx.fillStyle = onSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = onSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawReportRow(row: ReportRow, index: number, shift: theShift) {
  const value = row.valueOf(shift);
  const labelY = 102 + index * 52;
  ctx.fillStyle = "#233e43";
  ctx.fillText(`${row.label}: ${value}`, 18, labelY);
  ctx.fillStyle = row.color;
  ctx.fillRect(18, labelY + 8, value * 14, 20);
}

function writeReadout(shift: theShift) {
  readout.textContent =
    `Assigned: ${shift.supplyWorkers}/${crewSize} · Production: ${shift.production} · Consumption: ${shift.consumption} · Balance: ${
      shift.balance > 0 ? "+" : ""
    }${shift.balance}`;
}

function render() {
  const shift = calculateShift(supplyWorkers);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewTiles(shift);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${shift.supplyWorkers} / ${crewSize}`, 18, 76);
  REPORT_ROWS.forEach((row, index) => drawReportRow(row, index, shift));
  writeReadout(shift);
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
