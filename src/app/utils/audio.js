export function playBeep() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = 800;
  gain.gain.value = 0.1;

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (ctx.state === "suspended") {
    ctx.resume().then(() => {
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    });
  } else {
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }
}