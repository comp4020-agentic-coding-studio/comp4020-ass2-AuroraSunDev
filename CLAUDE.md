# Your harness

Standing rules for this repo, carried forward from earlier COMP4020 harnesses and
narrowed to what's likely to matter across most Assignment 2 sessions.

## Workflow

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before pushing; read a failing check's output before changing
  anything.
- Never commit a red state.
- Prefer small, targeted edits over unrelated redesign --- change what the task
  names, not what's around it.
- Explain broad or destructive changes (deleting files, rewriting several
  rules, restructuring pages) and wait for approval before applying them.

## Requirements and verification

- Verify requirement-sensitive decisions against the current official course
  source, using the handbook skill or published specification where
  available, rather than relying on memory or an earlier paraphrase.
- Check layout changes at both graded viewports, 1920x1080 and 390x844 ---
  both count in full.
- Headless Chrome clamps its layout viewport at roughly 490px: asking for
  `--window-size=390,844` does not give a real 390px layout, it gives a
  ~490px layout cropped to 390 and silently hides overflow that's actually
  there. Load the page in a 390px `<iframe>` on a wider window when checking
  the small viewport instead.

## The base path

Respect the configured base path, and do not introduce hand-written
root-absolute internal links (e.g. `href="/sessions/"` in an `.astro` file)
that bypass the project's link handling. Markdown links and the theme's
components are already rewritten for the base path --- write new links the
same way.

## Sensors

Before trusting a new check you've added, make it fail for the right reason
once: feed it something it should reject and read the message it prints.
