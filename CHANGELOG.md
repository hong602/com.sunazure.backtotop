# Changelog

All notable changes to the **Back to Top / 回到顶部** SiYuan plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-08-29

### Fixed

- **Disabled plugin no longer leaves a dangling button behind.** Removed the
  bottom-of-file `fallback` IIFE that used an untracked `setTimeout(1200ms)` to
  recreate the button outside the Plugin lifecycle — this was the root cause of
  the button reappearing after the plugin was disabled.
- **`onunload()` now cleans up every pending timer.** All timers scheduled
  during `onload` (layout-ready deferrals and the staggered `updateBtn`
  refresh passes) are now registered centrally and cleared on unload, so no
  deferred callback can touch the DOM after the plugin is turned off.
- Verified that the README's lifecycle promise ("禁用插件时会完整移除按钮
  DOM、监听器和定时器") is now fully enforced by the code.

### Notes

- This release addresses the maintainer review on bazaar PR #2174:
  https://github.com/siyuan-note/bazaar/pull/2174

## [1.0.1] - 2026-08-28

### Fixed

- Corrected the manifest field `plugin.json.url` to point to the actual plugin repository
  (`https://github.com/hong602/com.sunazure.backtotop`) instead of the author's profile page,
  so that the SiYuan Bazaar CI validation passes.

## [1.0.0] - 2026-08-28

### Added

- Initial public release of the **Back to Top / 回到顶部** plugin.
- Floating circular button (up-arrow) at the bottom-right corner of the editor.
- Smart show / hide logic: the button fades in when the active editor has scrolled down past 120 px, and fades out after returning to the top.
- Active-editor aware scroll-target detection, compatible with multi-tab / split-pane layouts (`protyle-content`, `protyle-scroll`, `layout-tab-container`, etc.).
- Smooth scroll to top via native `scrollTo({behavior:"smooth"})` with a `requestAnimationFrame`-based fallback.
- `requestAnimationFrame` throttling on scroll / resize / click events to keep overhead minimal.
- Theme-aware styling using SiYuan CSS variables, supporting both light and dark modes.
- Responsive sizing and positioning for small viewports (≤ 768 px, mobile / tablet).
- Strict SiYuan plugin lifecycle: `class BackToTopPlugin extends Plugin`, `constructor super(...args)`, `onload / onLayoutReady / onunload` for clean setup and teardown.
- Plugin assets: `icon.png` (160×160), `preview.png` (1024×768), English + Chinese READMEs.
- Author set to **蔚蓝升阳**, repository URL set to <https://github.com/hong602>.
