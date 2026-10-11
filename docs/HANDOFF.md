# APEX HANDOFF: read this first (any AI, any tool)

Owner: Mac (Rahmann Herman), Make It All Count LLC. Updated 2026-10-10, 8:30 PM Central.
GitHub: https://github.com/rahmaanherman-source

## How to work with Mac
- Plan first, then act. One step at a time, in sections. Give the single best answer, not options.
- Walkthroughs: say what page he's on, one action per step, where it is on screen, the exact button words, what to type, what to skip, what he'll see. Links to tap, never to type. (docs/GABBY_WALKTHROUGH_RULE.md)
- If any access is blocked or anything waits on his Save/approval, say so right away with the exact link to fix it. (docs/APEX_ACCESS_BLOCKER_RULE.md)
- Never fake "done/live/verified". Test it, then say it. Never put API keys inside a public web page.
- Design: full colour palettes he can pick from, not one fixed scheme. (reference/design/README.md)

## Today's only priorities
1. **APEX 360 booth** (event use). 2. **APEX Hub** (store). 3. **Radio / broadcast station**. 4. **Shopify** (APEX 365).
Everything else is parked: docs/audits/APEX_GROK_EXPORT_AUDIT_2026-10-10.md

## Where everything is
| Thing | Repo / branch | Live | State |
|---|---|---|---|
| 360 booth | apex-360 · branch `claude/360-wedding-ready` | https://apex-360-booth.netlify.app/360 | LIVE at commit a32e312 (Cool Mode, palettes, social upload). Later commits (phone-width fix 056af1b, how-to guide, "looking for people" hint) FAILED to build on Netlify, likely credits. Uncommitted local change: vite.config.ts picks preset `cloudflare-pages` when CF_PAGES is set (tested build OK). |
| Broadcast station (APEX Creator: 24/7 radio, DJ, broadcast studio) | Apex-five-Studio-v-2 (Mac calls it "Apex Live") · branch `claude/live-ready` | Google AI Studio publish: https://apex-creater.ai.studio | Branch fixes: Tailwind compiled (no CDN), no AI key in page, lockfile, Netlify/Cloudflare config, Radio Paradise default removed → `config/station.ts` STATION_STREAM_URL (empty until Mac's stream). Record: docs/STREAM_DEFAULT_RECORD.md |
| APEX Studio (DAW + radio console) | Apex-os-Studio · branch `claude/netlify-ready` | not deployed | builds clean |
| APEX Hub (Google AI Studio version) | apex-hub-production (pushed 10/10 7:35 PM) | not deployed | not reviewed yet |
| APEX Hub (Grok version) | APEX-HUB-GROK | — | not cleaned yet |
| Main site | Netlify project `apexlifeglobalhub` → apexlifeglobal.com | live | its "Open live store" links to ark-conduit-six8o.myshopify.com, NOT APEX 365. Fix. |
| Shopify APEX 365 | vercel-store-2f094fa4-wmvd1qhg.myshopify.com (primary domain apexlifeglobal.com) | — | the only real store |
| Flora Plug, Gabby Dictionary | flora-plug-GROK, apex-GABBY-DICTIONARY-GROK | — | parked |

## Hosting / money facts
- Netlify: free plan, 300 credits/month, cycle resets Oct 27–28; ~22 left on 10/10. Builds fail when out.
- Cloudflare: free plan. Invoice IN-81735547 ($4.88) payment failed; downgrade Oct 26 if unpaid. Check Billing → Subscriptions.
- apexlifeglobal.com DNS is on **Netlify** (nsone name servers), NOT Cloudflare (Cloudflare emailed in July: nameservers not updated).
- $12.50 "lifetime" = Apple App Store (Netli.fyi app), not Netlify.

## Next steps (in order)
1. OBS on Mac's Windows PC: Video 1920x1080 / 30 fps; Browser source URL = the broadcast station; Ctrl+F to fit; then YouTube Live stream key.
2. Move hosting to **Cloudflare Pages (free)**: connect GitHub once; projects for apex-360 (`claude/360-wedding-ready`) and Apex-five-Studio-v-2 (`claude/live-ready`).
3. Domains: 360.apexlifeglobal.com → booth, live.apexlifeglobal.com → broadcast station. Decide one DNS home (move name servers to Cloudflare, copy existing records first).
4. Set Mac's own stream in config/station.ts.
5. Clean APEX Hub, fix the store link to APEX 365.

## Blocked access
- Vercel connector (team apexs-projects-bd36c686): reconnect at https://claude.ai/customize/connectors
- Google Cloud: needs the chat linked to Mac's computer.
- Claude's cloud workspace can't upload to Netlify directly; deploys go through GitHub → host.
