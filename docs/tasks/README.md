# Task artifacts

This directory holds per-task artifacts produced by `/start-task`, one subdirectory per
task: the investigation (Argus), the plan (Athena), the Codex handoff and resulting diff,
the review (Themis), and the verification report (Apollo) — per the Standard documentation
tier chosen in `docs/agent/project-profile.md`.

Naming convention: `docs/tasks/{milestone}-{task-id}-{short-slug}/`, matching the git
branch name used for that task (see `docs/agent/workflow.md` → Git / commit strategy).

This directory is empty until the first task run under the bootstrapped workflow — M0 was
completed before bootstrap and is documented instead by its five merged PRs and
`docs/CODEX-KICKOFF.md`. Start populating this with M1 onward.
