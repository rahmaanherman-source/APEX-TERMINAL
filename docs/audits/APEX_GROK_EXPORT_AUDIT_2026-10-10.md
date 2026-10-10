# APEX Grok export audit, 2026-10-10

**Owner:** Mac. **Purpose:** everything that came off Grok, where it lives, and what it is. Nothing here is deployed unless marked TODAY.

## Today's only work
1. **APEX 360 booth** — wedding tonight.
2. **APEX Hub** (store).
3. **Radio station** (24/7 stream).
4. **Shopify** (APEX 365 store).

Everything else is parked in its repo and this report. We come back to it later.

## Grok exports (all private, all on GitHub)

| Repo | What it is | Pages / routes | State |
|---|---|---|---|
| [apex-360](https://github.com/rahmaanherman-source/apex-360) branch `claude/360-wedding-ready` | 360 booth, rebuilt | /360 booth, shop, hub, terminal, field, guest take, pay | **TODAY.** Grok removed, palette picker, direct social upload, Netlify-ready. RUNNABLE (camera verified in Chromium). Awaiting Netlify link. |
| [APEX-360-GROK](https://github.com/rahmaanherman-source/APEX-360-GROK) | Same booth code as apex-360 `main` (checked file by file) | — | Duplicate. Keep as Grok backup. |
| [APEX-HUB-GROK](https://github.com/rahmaanherman-source/APEX-HUB-GROK) | Apex Hub store ("GoDaddy-Beating Luxury E-Commerce Store") | shop, shop/category, product, cart, checkout, wishlist, compare, brands, discover, sell, account, login, ops, status, workspaces, apps, connect, sidekick | **TODAY.** Next to clean. |
| [flora-plug-GROK](https://github.com/rahmaanherman-source/flora-plug-GROK) | Flora Plug, newer than `Flora-plug` (has `.vercel`, index.html, new attachments) | marketplace, garden, identify, experts, community, challenges, near, blueprints, plants/slug, profile, loop, explore, audit | Parked. |
| [apex-GABBY-DICTIONARY-GROK](https://github.com/rahmaanherman-source/apex-GABBY-DICTIONARY-GROK) | Gabby Dictionary research app | dictionary, packets, sources, synthesis, calculators, analytics, red-team, queue, launch, owner, controls, fabric | Parked. |

## Google Cloud (from Mac, 2026-10-10)
Org `rahmaanherman-org` (661304977940). Folder "Proof of Concept" (871717951258). Projects: `godspeed-apex`, `gen-lang-client-0140165713` (Default Gemini Project), `flora-plug`, `godspeed-chameleon-core`, `project-dd1f291c-0f79-48fa-bcf`, `decoded-flag-486719-j9`.
**BLOCKED:** Claude's workspace cannot reach Google Cloud. Audit needs the chat linked to Mac's computer (Claude desktop app → Link to this computer). Parked.

## Access state
- Netlify deploy from Claude's workspace: BLOCKED (network). Fix: link each repo once in Netlify; after that every push deploys. 22 Netlify credits left.
- Vercel team `apexs-projects-bd36c686`: BLOCKED. Fix: https://claude.ai/customize/connectors
