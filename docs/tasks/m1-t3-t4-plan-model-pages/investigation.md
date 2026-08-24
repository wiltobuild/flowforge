# Investigation: m1-t3-t4-plan-model-pages

_Argus pass, 2026-08-23._

## Verified facts

**File layout**: only index stub pages exist under `src/content/docs/` today. No
`plan`/`model`/agent-profile content pages exist. `plans/index.mdx` and `agents/index.mdx`
explicitly say "built in M1"/"built in M4-T1" in their body text. `/agents/profiles/`
(sourced from `.claude/agents/`) is not built — those 5 `.md` files exist as source
material only. No collision risk with anything planned here.

**Data inventory** (from `plans.yaml`/`models.yaml`, confirmed):

| plan_id | tier |
|---|---|
| claude-free | free |
| claude-pro | entry |
| claude-max | mid |
| chatgpt-free | free |
| chatgpt-plus | entry |
| chatgpt-pro | high |

| model_id | available_on |
|---|---|
| claude-fable-5 | [claude-pro, claude-max] |
| claude-opus-5 | [claude-pro, claude-max] |
| claude-sonnet-5 | [claude-pro, claude-max] |
| claude-haiku-4-5 | [claude-pro, claude-max] |
| gpt-5.6-sol | [chatgpt-pro] |
| gpt-5.6-terra | [chatgpt-plus, chatgpt-pro] |
| gpt-5.6-luna | [chatgpt-free, chatgpt-plus, chatgpt-pro] |

`claude-free` and `chatgpt-free` are not `available_on` for any model — free-tier model
identity is unconfirmed (already noted in `plans.yaml`'s own `billing_notes`).

**Routing**: `astro.config.mjs` uses `{ autogenerate: { directory: '<name>' } }` per
section — routes/sidebar are derived from file path, not a manual array. Adding `.mdx`
files under `src/content/docs/plans/...` needs no config change. `reference/` already
proves a directory can hold a non-index leaf file alongside its index.

**Templates**: `docs/examples/plan.mdx` and `model.mdx` are valid, reference real IDs
(`chatgpt-plus`, `claude-sonnet-5`), and their body order matches `docs/02` exactly.
Their `last_verified: 2026-08-02` is a template artifact — drafted pages must set
`2026-08-23` to match the data's own verification date.

**Schema confirmation**: `content.ts`'s `plan_id`/`model_id` are both singular
`reference()` calls — no array variant anywhere in `content.ts`/`data.ts`/`taxonomy.ts`.
One page = one plan_id or one model_id, confirmed.

## Additional finding

The `plan` **tag axis** (`taxonomy.ts` `PLANS`) is `['free', 'claude-pro', 'chatgpt-plus',
'higher-tier', 'api']` — 5 buckets, not 6. This is a *different* field from `plan_id` (a
coarse filter for "which subscription do you need for this content," not a mirror of the
data join key), so it isn't the same conflict as the sitemap one — but it does mean each
of the 6 plan pages needs a considered mapping, not a mechanical 1:1 copy. See plan.md for
the resolved mapping.

## Risks

- 13 pages from 2 templates: one wrong assumption propagates uniformly. Mitigated by
  writing the full per-page manifest in plan.md before drafting, so execution is
  mechanical against a fully-specified table rather than 13 independent judgment calls.
- Starlight's `autogenerate` behavior without a per-directory `index.mdx` for the new
  `what-you-get/` and `models/[provider]/` subdirectories wasn't build-tested — will be
  confirmed by Apollo's real build, not assumed.
