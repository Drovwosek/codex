(function (app) {
  function $(selector) {
    return document.querySelector(selector);
  }

  function escapeHtml(value) {
    const node = document.createElement("div");
    node.textContent = value ?? "";
    return node.innerHTML;
  }

  function safeHttpUrl(value) {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  app.utils = { $, escapeHtml, safeHttpUrl };
})(window.Postovaya = window.Postovaya || {});

