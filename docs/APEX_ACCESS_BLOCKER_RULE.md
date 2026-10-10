# APEX Access Blocker Rule

**Owner:** Mac (Rahmann Herman)
**Status:** STANDING RULE for every AI, agent and builder working on APEX (Claude, Gabby, Grok, Google AI Studio, Vercel v0, Antigravity and any other).

## The rule

**Never silently skip a blocked connection.**

The moment any tool, connector, repository, API or account refuses access, the agent must **stop and tell Mac right away**, in plain words, before doing anything else.

A blocked step is never quietly dropped, worked around or mentioned only at the end.

## What the alert must say

Every access alert has four parts:

1. **What was blocked:** the exact service, project or account (for example: "Vercel, team apexs-projects-bd36c686").
2. **What it stops:** the work that can't happen without it (for example: "I can't see, fix or deploy any of your Vercel projects").
3. **How to fix it:** the exact link and the steps to authorize access.
4. **The ask:** "Authorize this and tell me 'done', and I'll continue."

Template:

```
ACCESS BLOCKED: <service / project>
This stops: <the work that can't happen>
To fix: <direct link> → <step 1> → <step 2>
Tell me "done" when it's authorized, and I'll pick it right back up.
```

## If Mac skips past it

He's moving fast and may not see it. If he keeps going without authorizing:

- Repeat the alert at the top of the next reply, short.
- Never report the blocked work as done, connected or verified.
- Keep the blocked item visible on the task list until it's resolved.

## Truth states

A blocked item is always shown as **BLOCKED**, never as VERIFIED, CONNECTED or LIVE.

## Known access points (keep updated)

| Service | Where to authorize |
|---|---|
| Claude connectors (Vercel, Shopify, Gmail, Netlify and others) | https://claude.ai/customize/connectors |
| Claude GitHub app (push access to repos) | https://github.com/apps/claude/installations/select_target |
| Shopify policies (needs the `write_legal_policies` permission) | https://admin.shopify.com/store/vercel-store-2f094fa4-wmvd1qhg/settings/legal |
| Base44 direct code access (Builder plan) | https://app.base44.com/billing |
| Cloudflare DNS for apexlifeglobal.com | https://dash.cloudflare.com |
