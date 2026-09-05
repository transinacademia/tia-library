# Site fonts

The site embeds a small, self-hosted subset of
[Sarasa Gothic](https://github.com/be5invis/sarasa-gothic) release `v1.0.41`
in `public/fonts/`. It includes the Simplified Chinese regular and bold
proportional faces and the regular monospaced face used by code blocks. The
files are WOFF2 subsets containing the characters used by the site's source
content plus ASCII, Latin-1, and common CJK punctuation. No font CDN or
hotlink is used.
`font-display: swap` and the system fallbacks keep text usable while the files
load or if a browser cannot use them.

The subsets were generated from the upstream TTF files with
[`fontTools`](https://github.com/fonttools/fonttools) `pyftsubset`, preserving
the OpenType layout features. When adding documentation with new characters,
regenerate the subsets (including the new source text) or rely on the listed
system fallbacks; do not replace them with an unsubsetted TTF.

The three WOFF2 files total about 1.4 MB (roughly 96.5% smaller than the former
40.0 MB of TTF payload). The regular and bold faces intentionally share the
same character set, so switching weight does not trigger a missing-glyph
fallback.

The upstream project and its component fonts are licensed under the SIL Open
Font License 1.1. The complete license and copyright notice is preserved in
[`Sarasa-Gothic-LICENSE.txt`](./Sarasa-Gothic-LICENSE.txt). Sarasa Gothic is embedded as a character subset, and the files must not be
sold by themselves.
