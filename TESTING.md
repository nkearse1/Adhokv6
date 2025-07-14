# Codex Test Plan

This project relies on TypeScript strict mode. The main test suite is the `type-check` script which runs the TypeScript compiler with no emission.

```
yarn type-check

```

Before committing, run the full verification suite:
```
yarn verify
```

The `verify` script runs `yarn lint`, `yarn type-check`, `yarn check-lockfile` and `yarn check-eslint-versions`.

During CI and `prebuild` a custom script `check-type-imports` runs to ensure framework types such as `Metadata`, `NextRequest` and `NextApiRequest` are only imported using `import type` statements and that no legacy `require()` calls are present.
