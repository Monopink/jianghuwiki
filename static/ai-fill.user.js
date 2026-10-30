// ==UserScript==
// @name         Jianghu Wiki AI prompt filler
// @namespace    https://www.jhwiki.com/
// @version      1.0.0
// @description  Fill AI chat inputs from the q URL parameter without sending
// @downloadURL  https://www.jhwiki.com/ai-fill.user.js
// @updateURL    https://www.jhwiki.com/ai-fill.user.js
// @match        https://www.kimi.ai/*
// @match        https://kimi.ai/*
// @match        https://chat.qwen.ai/*
// @match        https://www.dola.com/chat/*
// @match        https://www.doubao.com/chat/*
// @match        https://gemini.google.com/app*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const prompt = new URLSearchParams(window.location.search).get("q");
  if (!prompt) return;

  const site = window.location.hostname;
  const selectors = {
    "www.kimi.ai": '.chat-input-editor[data-lexical-editor="true"][role="textbox"]',
    "kimi.ai": '.chat-input-editor[data-lexical-editor="true"][role="textbox"]',
    "chat.qwen.ai": "textarea.message-input-textarea",
    "www.dola.com": '[data-testid="chat_input_input"] .tiptap.ProseMirror',
    "www.doubao.com": '[data-testid="chat_input_input"] .tiptap.ProseMirror',
    "gemini.google.com": '.ql-editor[role="textbox"]'
  };
  const selector = selectors[site];
  if (!selector) return;

  let filled = false;

  function emit(element, type) {
    element.dispatchEvent(new Event(type, { bubbles: true }));
  }

  function fillTextControl(element) {
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value"
    ).set;
    valueSetter.call(element, prompt);
    emit(element, "input");
    emit(element, "change");
  }

  function fillEditable(element) {
    element.focus();

    function selectContents() {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    selectContents();

    const inserted = document.execCommand("insertText", false, prompt);
    const currentText = element.textContent || "";
    if (inserted && currentText.includes(prompt)) {
      emit(element, "change");
      return;
    }

    // Lexical-based editors handle a real paste event more reliably than DOM changes.
    selectContents();
    if (typeof DataTransfer !== "undefined" && typeof ClipboardEvent !== "undefined") {
      const transfer = new DataTransfer();
      transfer.setData("text/plain", prompt);
      element.dispatchEvent(new ClipboardEvent("paste", {
        bubbles: true,
        clipboardData: transfer
      }));
    } else {
      element.replaceChildren(document.createTextNode(prompt));
      emit(element, "input");
    }

    emit(element, "change");
  }

  function tryFill() {
    if (filled) return true;
    const element = document.querySelector(selector);
    if (!element) return false;

    if (element.matches("textarea, input")) {
      fillTextControl(element);
    } else {
      fillEditable(element);
    }
    filled = true;
    observer.disconnect();
    return true;
  }

  const observer = new MutationObserver(tryFill);

  function start() {
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true
    });
    tryFill();
  }

  if (document.documentElement) {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  }
})();
