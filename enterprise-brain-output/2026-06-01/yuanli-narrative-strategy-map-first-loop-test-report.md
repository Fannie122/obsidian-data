# yuanli-narrative-strategy-map first loop test

Date: 2026-06-01

## Install

- Skill repo: `https://github.com/moonstachain/yuanli-narrative-strategy-map.git`
- Installed path: `C:\Users\GS11DZ02382\.codex\skills\yuanli-narrative-strategy-map`
- Install method: `git clone --depth 1`
- Key files verified:
  - `SKILL.md`
  - `templates\v8-skeleton.html`
  - `references\module-library.md`
  - `references\tongguan-map-v3-alignment.md`
  - `references\freeform-ingestion.md`
  - `references\extraction-schema.md`

## Test Input

- Source material: current Ruifang strategy map materials and previous generated H5.
- Main output under validation: `C:\Users\GS11DZ02382\Documents\New project\enterprise-brain-output\2026-06-01\ruifang-yuanli-entrepreneurship-map.html`

## Test Output

- Smoke-test copy: `C:\Users\GS11DZ02382\Documents\New project\enterprise-brain-output\2026-06-01\yuanli-narrative-strategy-map-first-loop-test.html`

## Validation

- File exists: pass
- Size: 72,971 bytes
- Lines: 789
- Required anchors: pass
  - `intro`
  - `gate1`
  - `gate2`
  - `gate3`
  - `gate4`
  - `closing`
- Formula check: pass
  - `财富 = 借势 × 合力`
- Animation script check: pass
  - `IntersectionObserver`
- Version marker check: pass
  - `RUIFANG V2`

## Notes

The public GitHub repo does not include the private `examples/narrative-strategy-map-V8-reference.html` gold-standard file referenced by `SKILL.md`, so the byte-identical CSS diff against that private example could not be run. The installed public skill structure, references, template, rendered H5 anchors, formula, and animation script all passed the smoke test.
