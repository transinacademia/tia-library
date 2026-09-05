# Site fonts

The site embeds a small, self-hosted subset of
[Sarasa Gothic](https://github.com/be5invis/sarasa-gothic) release `v1.0.41`
in `public/fonts/`. It includes the Simplified Chinese regular and bold
proportional faces and the regular monospaced face used by code blocks. The
files are the upstream unhinted TrueType files; no font CDN or hotlink is used.
`font-display: swap` and the system fallbacks keep text usable while the files
load or if a browser cannot use them.

The upstream project and its component fonts are licensed under the SIL Open
Font License 1.1. The complete license and copyright notice is preserved in
[`Sarasa-Gothic-LICENSE.txt`](./Sarasa-Gothic-LICENSE.txt). Sarasa Gothic is
embedded without modification, and the files must not be sold by themselves.
