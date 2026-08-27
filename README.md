# Back to Top

A lightweight SiYuan Notes plugin that adds a floating **Back to Top** button to the editor area. It behaves just like the "scroll-to-top" buttons commonly seen on web pages: hidden by default, fades in once you scroll down past a threshold, and smoothly scrolls the active document back to the top when clicked.

[![Plugin preview](preview.png)](preview.png)

## Features

- ✨ **Web-style floating button** — fixed at the bottom-right corner, rounded, shadowed, with hover/press animations.
- 👁️ **Smart show/hide** — stays hidden at the top of the document, and fades in automatically once the active editor has scrolled more than **120 px** downwards.
- 🧭 **Active-editor aware** — picks the real scroll container of the currently focused document (works in multi-tab / multi-panel layouts, `.protyle-content`, `.protyle-scroll`, `.layout-tab-container` and more).
- 🚀 **Smooth scroll** — uses native `scrollTo({behavior:"smooth"})` and falls back to a `requestAnimationFrame + easeOutCubic` animation on unsupported platforms.
- ⚡ **Throttled updates** — all scroll / resize events are throttled through `requestAnimationFrame` so the plugin does not impact typing or scrolling performance.
- 🌗 **Theme & responsive** — supports light and dark modes via SiYuan CSS variables, and adapts size/position on small screens (mobile / tablet).
- 🛡️ **Clean lifecycle** — strictly follows SiYuan plugin conventions (`extends Plugin`, `constructor super(...args)`, `onload / onLayoutReady / onunload`). When disabled the DOM node, listeners and timers are all removed.

## Installation

### From the Community Bazaar (recommended)

After this plugin is published to the SiYuan Community Bazaar, search for **Back to Top / 回到顶部** in **Settings → Plugins → Bazaar**, then click **Install**.

### Manual / Local install

1. Build (or download) the release `package.zip` from the [GitHub Releases](https://github.com/hong602/com.sunazure.backtotop/releases) page.
2. Open **SiYuan → Settings → Plugins → Downloaded → Install local plugin**, pick the `package.zip`.
3. Enable the **Back to Top** toggle.
4. Open any sufficiently long note, scroll down more than a little bit, and the button will appear at the bottom-right.

## Usage

1. Open a long note in SiYuan.
2. Scroll down past roughly **120 px** (about one paragraph or a bit less).
3. A circular blue button with an **up-arrow ⬆** appears at the bottom-right corner.
4. Click the button — the current document will **smoothly scroll to the very top**, and the button will automatically fade out once you are there.

> 💡 Tip: if you open multiple tabs or split panes, the plugin always targets the scroll container that belongs to the focused / visible document.

## Configuration

This plugin intentionally ships **without any settings UI** — it works out of the box. The default behavior and values:

| Item | Default | Remarks |
|---|---|---|
| Show threshold | 120 px | Scroll distance inside the active editor before the button shows |
| Position | Fixed `right:30px / bottom:40px` | `right:18px / bottom:26px` on viewports ≤ 768 px |
| Size | 44×44 px | 40×40 px on viewports ≤ 768 px |
| Smooth scroll duration | ~320 ms | Uses native smooth scroll when available |
| Color | `var(--b3-theme-primary)` | Adapts to your current theme and light/dark mode |

Advanced users can tweak any of the above by editing `index.css` (position / size / colors) or the constants at the top of `index.js` (threshold / duration).

## Compatibility

| Dimension | Supported |
|---|---|
| Minimum SiYuan version | `2.8.0+` |
| Frontends | desktop, desktop-window, browser-desktop, browser-mobile, mobile |
| Backends | Windows, macOS, Linux, Docker, Android, iOS, HarmonyOS |
| Publish mode | Disabled (`disabledInPublish: false` but scroll UI is editor-only) |

## Project layout

```
com.sunazure.backtotop/
├── plugin.json        # Plugin metadata
├── index.js           # Plugin entry — zero build, plain JS
├── index.css          # Button styles (light/dark + responsive)
├── icon.png           # 160×160 plugin icon
├── preview.png        # 1024×768 Bazaar preview image
├── README.md          # English readme (this file)
├── README_zh-CN.md    # Chinese readme
└── CHANGELOG.md       # Release notes
```

## FAQ

**Q: I don't see the button even after scrolling.**
- Make sure the plugin is actually enabled in **Settings → Plugins**.
- Fully restart SiYuan after updating / replacing the plugin files (the backend reads `index.js` / `index.css` once on load).
- Open DevTools (`Ctrl + Shift + I`) Console and look for lines tagged `[backtotop]`. If nothing shows, the plugin is not loaded.

**Q: The button shows but clicking does nothing.**
- The plugin targets the currently focused scroll container. Click once inside the text area to move the focus into the document, then try again.
- If it still does nothing, open DevTools Console and click the button — a line like `[backtotop] 点击回到顶部，scroller=...` is printed. Tell me the value of `scroller` in a GitHub issue.

**Q: Does this plugin sync my data / read my notes?**
- No. It runs purely on the frontend side and never touches the SiYuan data directory or network.

## Reporting issues / Contributing

- Bug reports and feature requests: [GitHub Issues](https://github.com/hong602/com.sunazure.backtotop/issues)
- Pull requests are welcome. Please describe what you are changing and why.

## Author

- **蔚蓝升阳**
- Repository: <https://github.com/hong602/com.sunazure.backtotop>

## License

MIT
