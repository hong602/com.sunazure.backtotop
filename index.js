/**
 * 回到顶部 (Back to Top) 插件
 *
 * 关键（修复 "does not extends Plugin"）：
 *   必须使用 ES6 `class … extends Plugin` 关键字声明，并且直接作为
 *   module.exports.default 导出。不要用手动挂 prototype 的传统继承
 *   写法——思源内部校验不是只查 `instanceof`，还会检查源码/原型结构。
 */

"use strict";

var BTN_ID = "sunazure-back-to-top-btn";
var THRESHOLD = 120; // 触发高亮显示的滚动阈值（px）

function log() {
  try {
    var args = Array.prototype.slice.call(arguments);
    args.unshift("[backtotop]");
    if (console && console.log) Function.prototype.apply.call(console.log, console, args);
  } catch (_) {}
}

/* ---------- 滚动容器识别 ---------- */

function isScrollable(el) {
  if (!el || el.nodeType !== 1) return false;
  if (el === document.body || el === document.documentElement) return false;
  var style;
  try { style = window.getComputedStyle(el); } catch (_) { return false; }
  var ov = String(style.overflowY || style.overflow || "").toLowerCase();
  if (ov !== "auto" && ov !== "scroll") return false;
  return el.scrollHeight - el.clientHeight > 4;
}

function getActiveScroller() {
  // 1) 从当前聚焦元素一路向上，找最近的可滚动祖先
  var cur = document.activeElement;
  while (cur && cur !== document.body && cur.parentNode) {
    if (isScrollable(cur)) return cur;
    cur = cur.parentNode;
  }

  // 2) 常见容器打分：在视口内 + 高度大 + 已滚动过的优先
  var selectors = [
    ".protyle-content",
    ".protyle-scroll",
    ".protyle",
    ".layout-tab-container",
    ".layout__center",
    ".fn__flex-1",
  ];
  var best = null;
  var bestScore = -1;
  for (var i = 0; i < selectors.length; i++) {
    var list;
    try { list = document.querySelectorAll(selectors[i]); } catch (_) { continue; }
    for (var j = 0; j < list.length; j++) {
      var el = list[j];
      if (!isScrollable(el)) continue;
      var r;
      try { r = el.getBoundingClientRect(); } catch (_) { continue; }
      if (r.height <= 0 || r.width <= 0) continue;
      var inVp = r.top < (window.innerHeight - 20) && r.bottom > 60;
      var score = (inVp ? 10000 : 0) + r.height + Math.min(el.scrollTop | 0, 5000);
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }
  }
  return best;
}

/* ---------- 平滑滚动 ---------- */

function smoothScrollToTop(scroller) {
  if (!scroller) return;
  if (typeof scroller.scrollTo === "function") {
    try {
      scroller.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    } catch (_) {}
  }
  var duration = 320;
  var start = (typeof performance !== "undefined" && performance.now)
    ? performance.now() : Date.now();
  var from = scroller.scrollTop | 0;
  if (from <= 0) return;
  function step(now) {
    var t = Math.min(1, ((now | 0) - (start | 0)) / duration);
    var ease = 1 - Math.pow(1 - t, 3);
    scroller.scrollTop = from * (1 - ease);
    if (t < 1 && (scroller.scrollTop | 0) > 0) {
      requestAnimationFrame(step);
    } else {
      scroller.scrollTop = 0;
    }
  }
  requestAnimationFrame(step);
}

/* ---------- 按钮 DOM ---------- */

function ensureButton() {
  var btn = document.getElementById(BTN_ID);
  if (btn) return btn;
  btn = document.createElement("button");
  btn.id = BTN_ID;
  btn.type = "button";
  btn.className = "sunazure-back-to-top-btn";
  btn.setAttribute("aria-label", "回到顶部");
  btn.setAttribute("title", "回到顶部");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" ' +
    'stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="18 15 12 9 6 15"></polyline>' +
    '</svg>';
  btn.addEventListener("click", function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    var s = getActiveScroller();
    log("点击回到顶部，scroller=", s && (s.className || s.tagName), "scrollTop=", s && s.scrollTop);
    smoothScrollToTop(s);
  });
  var host = document.body || document.documentElement;
  if (host && host.appendChild) host.appendChild(btn);
  log("按钮已创建：", btn);
  return btn;
}

function removeButton() {
  var btn = document.getElementById(BTN_ID);
  if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
}

/* ---------- 生命周期资源：定时器统一登记，onunload 时全部清理 ---------- */

var pendingTimers = [];
function scheduleTimer(fn, delay) {
  var id = setTimeout(function () {
    // 触发后从登记表里移除
    var i = pendingTimers.indexOf(id);
    if (i >= 0) pendingTimers.splice(i, 1);
    fn();
  }, delay);
  pendingTimers.push(id);
  return id;
}
function clearAllTimers() {
  for (var i = 0; i < pendingTimers.length; i++) {
    try { clearTimeout(pendingTimers[i]); } catch (_) {}
  }
  pendingTimers.length = 0;
}

/* ---------- 可见性更新 ---------- */

var rafId = 0;
function updateBtn() {
  var btn = document.getElementById(BTN_ID);
  if (!btn) return;
  var s = getActiveScroller();
  var top = s ? (s.scrollTop | 0) : 0;
  var show = !!s && top > THRESHOLD;
  if (btn.classList && btn.classList.toggle) {
    btn.classList.toggle("sunazure-back-to-top--show", show);
  } else {
    var re = /\s*sunazure-back-to-top--show\s*/g;
    var cls = (btn.className || "").replace(re, " ");
    btn.className = (cls + (show ? " sunazure-back-to-top--show" : "")).trim();
  }
}

function throttledUpdate() {
  if (rafId) return;
  rafId = requestAnimationFrame(function () {
    rafId = 0;
    updateBtn();
  });
}

var bound = false;
function bindListeners() {
  if (bound) return;
  bound = true;
  document.addEventListener("scroll", throttledUpdate, true);
  window.addEventListener("resize", throttledUpdate, true);
  window.addEventListener("hashchange", throttledUpdate, true);
  document.addEventListener("click", throttledUpdate, true);
}

function unbindListeners() {
  if (!bound) return;
  bound = false;
  document.removeEventListener("scroll", throttledUpdate, true);
  window.removeEventListener("resize", throttledUpdate, true);
  window.removeEventListener("hashchange", throttledUpdate, true);
  document.removeEventListener("click", throttledUpdate, true);
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
}

/* ===================================================================
 * 插件类：必须使用 ES6 class 关键字真正 extends Plugin
 * Plugin 是外层函数参数注入的标识符：
 *   (function(Plugin, app, isMobile, …){ …代码… })(Plugin, app, …)
 * 所以这里直接写 `extends Plugin` 是合法的，不会报 ReferenceError。
 * =================================================================== */
class BackToTopPlugin extends Plugin {
  constructor() {
    // —— 必须调用 super()，把参数原样透传给父类 Plugin 的构造函数 ——
    // 不同 siyuan 版本 Plugin 构造函数签名不一致，这里用展开运算符最稳。
    super(...arguments);
  }

  onload() {
    var self = this;
    log("onload 触发；this.onLayoutReady =", typeof (self && self.onLayoutReady));
    var kick = function () {
      ensureButton();
      bindListeners();
      updateBtn();
      scheduleTimer(updateBtn, 200);
      scheduleTimer(updateBtn, 800);
      scheduleTimer(updateBtn, 1600);
    };
    if (self && typeof self.onLayoutReady === "function") {
      try { self.onLayoutReady(kick); return; }
      catch (e) { log("onLayoutReady 抛错：", e); }
    }
    var go = function () { scheduleTimer(kick, 50); };
    if (document.readyState === "complete" || document.readyState === "interactive") {
      go();
    } else {
      window.addEventListener("DOMContentLoaded", go, { once: true });
    }
  }

  onunload() {
    log("onunload 触发：清理定时器、监听器、按钮 DOM");
    // 1) 先清所有尚未触发的定时器（包括 kick 延迟、refresh 轮询），
    //    否则它们会在插件禁用后再次操作 DOM。
    clearAllTimers();
    // 2) 移除事件监听 + 取消 rAF
    unbindListeners();
    // 3) 移除按钮 DOM
    removeButton();
  }
}

/* —— 导出：同时赋给 default 和本体，兼容不同 siyuan 版本读取策略 —— */
if (typeof module !== "undefined") {
  module.exports = BackToTopPlugin;
  module.exports.default = BackToTopPlugin;
}

/* 注意：不再保留底部的 fallback IIFE 兜底逻辑。
 * 之前的 fallback 用 setTimeout(1200ms) 无条件创建按钮，绕过了 Plugin
 * 生命周期，导致用户禁用插件后按钮会"死灰复燃"，这正是维护者 review
 * 指出的 bug。现在按钮的创建与销毁完全由 onload/onunload 控制，
 * 生命周期行为可预测、可清理。 */
