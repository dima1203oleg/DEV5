const { JSDOM } = require("jsdom");

(async () => {
  const dom = await JSDOM.fromURL("http://localhost:3000/", {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true
  });
  
  dom.window.console.error = (...args) => {
    console.error("PAGE ERROR:", ...args);
  };
  
  dom.window.console.warn = (...args) => {
    console.warn("PAGE WARN:", ...args);
  };

  dom.window.addEventListener("error", (event) => {
    console.error("UNCAUGHT:", event.error);
  });
  
  dom.window.addEventListener("unhandledrejection", (event) => {
    console.error("UNHANDLED PROMISE:", event.reason);
  });

  setTimeout(() => {
    const html = dom.window.document.body.innerHTML;
    if (html.includes("Something went wrong")) {
      console.log("ErrorBoundary triggered!");
      console.log(dom.window.document.querySelector("pre").textContent);
    } else {
      console.log("No ErrorBoundary found. HTML length:", html.length);
    }
  }, 5000);
})();
