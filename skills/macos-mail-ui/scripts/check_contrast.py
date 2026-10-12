#!/usr/bin/env python3
"""Validate WCAG text contrast of token pairs in the bundled CSS.
No third-party dependencies. Run: python3 scripts/check_contrast.py
"""
from __future__ import annotations
import pathlib
import re
import sys

CSS = pathlib.Path(__file__).resolve().parents[1] / "assets" / "tokens.css"
TEXT_MIN = 4.5


def rgb(color: str) -> tuple[float, float, float]:
    c = color.lstrip('#')
    if len(c) != 6:
        raise ValueError(f"Expected six-digit hex color: {color}")
    return tuple(int(c[i:i + 2], 16) / 255 for i in (0, 2, 4))


def luminance(color: str) -> float:
    def linear(x: float) -> float:
        return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
    r, g, b = map(linear, rgb(color))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: str, b: str) -> float:
    v1, v2 = sorted((luminance(a), luminance(b)), reverse=True)
    return (v1 + 0.05) / (v2 + 0.05)


def theme_variables(css: str, theme: str) -> dict[str, str]:
    # Each theme has a distinct attribute block. The light block also includes :root.
    match = re.search(rf'\[data-theme="{re.escape(theme)}"\]\s*\{{(.*?)\}}', css, flags=re.S)
    if not match:
        raise ValueError(f"Missing data-theme={theme} block")
    return dict(re.findall(r'(--[a-z-]+)\s*:\s*(#[0-9A-Fa-f]{6})\s*;', match.group(1)))


def main() -> int:
    css = CSS.read_text(encoding="utf-8")
    ok = True
    for theme in ("light", "dark"):
        vars_ = theme_variables(css, theme)
        pairs = [
            ("primary on bg", "--ui-fg", "--ui-bg"),
            ("muted on bg", "--ui-fg-muted", "--ui-bg"),
            ("primary on panel", "--ui-fg", "--ui-panel"),
            ("accent button", "--ui-fg-on-accent", "--ui-accent"),
        ]
        for label, fg, bg in pairs:
            result = contrast(vars_[fg], vars_[bg])
            passes = result >= TEXT_MIN
            ok &= passes
            print(f"{theme:5s} | {label:18s} | {result:5.2f}:1 | {'PASS' if passes else 'FAIL'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
