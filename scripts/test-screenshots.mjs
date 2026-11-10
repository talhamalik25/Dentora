import { spawn } from "child_process";
import fs from "fs";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProcess = spawn(chromePath, [
  "--headless=new",
  "--remote-debugging-port=9222",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--window-size=1440,900"
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const versionRes = await fetch("http://127.0.0.1:9222/json/list");
  const pages = await versionRes.json();
  const page = pages[0];
  const wsUrl = page.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data.result);
      callbacks.delete(data.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send("Page.enable");
  await send("DOM.enable");
  await send("Page.navigate", { url: "http://localhost:3000" });

  await new Promise(r => setTimeout(r, 3500));

  // Test expanded final state at 1440px
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Scroll to #experience start
  await send("Runtime.evaluate", {
    expression: `
      const el = document.getElementById('experience');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 400));

  // Scroll down by 750px (driving GSAP scrollTrigger to full expansion)
  await send("Runtime.evaluate", {
    expression: `window.scrollBy(0, 750);`
  });
  await new Promise(r => setTimeout(r, 800));

  const shotExpanded = await send("Page.captureScreenshot", { format: "png" });
  if (shotExpanded && shotExpanded.data) {
    fs.writeFileSync("f:\\programming\\dentora\\qa_1440px_expanded.png", Buffer.from(shotExpanded.data, "base64"));
    console.log("Captured qa_1440px_expanded.png");
  }

  // Also capture expanded at 768px and 375px
  // Tablet:
  await send("Emulation.setDeviceMetricsOverride", {
    width: 768,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await send("Runtime.evaluate", {
    expression: `
      const el = document.getElementById('experience');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 400));
  await send("Runtime.evaluate", { expression: `window.scrollBy(0, 500);` });
  await new Promise(r => setTimeout(r, 800));
  const shotTablet = await send("Page.captureScreenshot", { format: "png" });
  if (shotTablet && shotTablet.data) {
    fs.writeFileSync("f:\\programming\dentora\\qa_768px_expanded.png", Buffer.from(shotTablet.data, "base64"));
    console.log("Captured qa_768px_expanded.png");
  }

  // Mobile:
  await send("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await send("Runtime.evaluate", {
    expression: `
      const el = document.getElementById('experience');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 400));
  await send("Runtime.evaluate", { expression: `window.scrollBy(0, 320);` });
  await new Promise(r => setTimeout(r, 800));
  const shotMobile = await send("Page.captureScreenshot", { format: "png" });
  if (shotMobile && shotMobile.data) {
    fs.writeFileSync("f:\\programming\\dentora\\qa_375px_expanded.png", Buffer.from(shotMobile.data, "base64"));
    console.log("Captured qa_375px_expanded.png");
  }

  ws.close();
} catch (err) {
  console.error("Error:", err);
} finally {
  chromeProcess.kill();
}
