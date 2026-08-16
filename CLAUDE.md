# CLAUDE.md

Guidance for AI agents working in this repository.

## The gate

Every feature, fix or refactor must leave this command green before it counts as
done:

```bash
pnpm verify
```

It runs, in order: `lint` → `typecheck` → `test` → `react-doctor` → `fallow`. A
non-zero exit means the work is not finished. Run `pnpm build` too when the
change touches `pages/`, `next.config.mjs` or anything under `plugins/`.

## Rules

- Fix the source. Do not silence a finding by lowering a rule severity, adding
  an ignore entry, or adding an inline suppression comment.
- If a finding really is a false positive, add the exception to
  `doctor.config.jsonc`, `.fallowrc.jsonc` or `pnpm-workspace.yaml` **with a
  comment explaining why**, and call it out in the PR.
- Both analysers are configured with every rule at `error`, so there are no
  warnings to triage — anything reported blocks.

## Conventions

- Package manager **pnpm 11**, Node 24 (`.nvmrc`), both pinned by
  `packageManager` + `engines` and installed through Corepack.
- pnpm's own settings (supply-chain policy) live in `pnpm-workspace.yaml`; since
  v11 pnpm ignores the `pnpm` field of `package.json`.
- Script names must not collide with a pnpm built-in, because `pnpm <builtin>`
  silently runs the built-in instead of the script. That is why the gate is
  called `verify` (not `check`) and the react-doctor script is called
  `react-doctor` (not `doctor`). Chained scripts always use `pnpm run <script>`.
- Next.js **Pages Router**. No TypeScript path aliases — imports are relative.
- ESLint uses the legacy `.eslintrc.json` (airbnb + `next/core-web-vitals`).
  JSX attributes use double quotes; Prettier is not installed, so ESLint is the
  only formatter of record.
- Conventional commits with a short scope: `fix(store):`, `feat(tooling):`.
