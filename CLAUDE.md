# CLAUDE.md

Guidance for AI agents working in this repository.

## The gate

Every feature, fix or refactor must leave this command green before it counts as
done:

```bash
yarn verify
```

It runs, in order: `lint` → `typecheck` → `test` → `doctor` → `fallow`. A
non-zero exit means the work is not finished. Run `yarn build` too when the
change touches `pages/`, `next.config.js` or anything under `plugins/`.

## Rules

- Fix the source. Do not silence a finding by lowering a rule severity, adding
  an ignore entry, or adding an inline suppression comment.
- If a finding really is a false positive, add the exception to
  `doctor.config.jsonc` or `.fallowrc.jsonc` **with a comment explaining why**,
  and call it out in the PR.
- Both analysers are configured with every rule at `error`, so there are no
  warnings to triage — anything reported blocks.

## Conventions

- Package manager **yarn v1**, Node 22 (`.nvmrc`). Note `yarn check` is a yarn
  built-in, which is why the gate is called `verify`.
- Next.js **Pages Router**. No TypeScript path aliases — imports are relative.
- ESLint uses the legacy `.eslintrc.json` (airbnb + `next/core-web-vitals`).
  JSX attributes use double quotes; Prettier is not installed, so ESLint is the
  only formatter of record.
- Conventional commits with a short scope: `fix(store):`, `feat(tooling):`.
