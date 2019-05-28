const detectShape = require("../");

const [width, height] = [600, 600];

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
canvas.style.border = "1px solid #eee";
document.body.appendChild(canvas);

const sidebar = document.createElement("div");
sidebar.style.fontFamily = "sans-serif";
sidebar.style.marginLeft = "20px";
document.body.appendChild(sidebar);

document.body.style.display = "flex";
document.body.style.padding = 0;
document.body.style.margin = 0;

const state = {
  isDown: false,
  points: []
};

const updateSidebar = () => {
  sidebar.innerText = `
    detected shape: ${state.detected.shape}
    time: ${state.detectionTime}ms
  `;
};

canvas.addEventListener("mousedown", e => {
  state.isDown = true;
  state.points = [[e.clientX, e.clientY]];
});

canvas.addEventListener("mousemove", e => {
  if (state.isDown) {
    state.points.push([e.clientX, e.clientY]);
  }
});

canvas.addEventListener("mouseup", () => {
  state.isDown = false;

  const t = Date.now();
  state.detected = detectShape(state.points);
  const dt = Date.now() - t;

  state.detectionTime = dt;

  updateSidebar();
});

const ctx = canvas.getContext("2d");

const draw = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  if (state.points.length > 0) {
    ctx.beginPath();
    ctx.moveTo(state.points[0][0], state.points[0][1]);

    for (let i = 1; i < state.points.length; i++) {
      ctx.lineTo(state.points[i][0], state.points[i][1]);
    }

    ctx.stroke();
  }

  requestAnimationFrame(draw);
};

draw();
