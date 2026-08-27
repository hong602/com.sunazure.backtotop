# Changelog

All notable changes to the **Back to Top / 回到顶部** SiYuan plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
