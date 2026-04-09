export function handlePageRules(path, seconds) {
  console.log("RULE CHECK:", path, seconds);

  if (path === "/page1") {
    if (seconds >= 2) console.log("⚠️ Page1 warning");
    if (seconds >= 4) console.log("🔥 Page1 action");
  }

  if (path === "/page2") {
    if (seconds >= 3) console.log("👁️ Page2 trigger");
  }

  if (path === "/page3") {
    if (seconds >= 5) console.log("🚨 Page3 alert");
  }
}