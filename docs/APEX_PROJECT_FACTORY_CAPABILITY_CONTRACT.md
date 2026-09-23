# APEX Project Factory Capability Contract

## Purpose

APEX treats modern agent platforms as replaceable capability providers. The system does not depend on a single model or hosted product.

The project-factory request is:

`RESEARCH → PLAN → BUILD → GENERATE ARTIFACTS → VERIFY → PACKAGE`

A single project may produce:

- research and source notes
- business concept and operating plan
- financial model
- spreadsheet/workbook
- presentation
- brand system
- website
- application mockups
- application implementation
- animations and interactive media
- sales materials

## Kimi capability mapping

Kimi K2.6 is registered as an agent/provider candidate for long-horizon coding and motion-rich frontend work. Moonshot's published K2.6 announcement describes 4,000+ tool calls, long-running execution, frontend/devops work, videos in hero sections, WebGL shaders, GSAP/Framer Motion, and Three.js. These are provider-reported capabilities and remain subject to actual adapter probes before APEX marks them VERIFIED.

Kimi's current help documentation distinguishes K2.6 from K3: K2.6 is optimized for faster Q&A, while K3 is positioned for complex Agent tasks and editable document/PPT/spreadsheet generation. APEX therefore registers both rather than treating the transcript's K2.6 workflow as the current universal Kimi capability.

## DeepSeek capability mapping

DeepSeek is registered as a replaceable reasoning/agent provider.

Current DeepSeek API documentation identifies `deepseek-flash` as DeepSeek-V4.1-Flash, with 1M context, JSON output, tool calls, Responses API support, Anthropic-compatible API support, and vision. DeepSeek-V4-Pro-0813 remains separately registered with 1M context and tool/structured-output support.

APEX does not hard-code transcript pricing claims. Provider pricing, hosted availability, free access, quotas, promotions, and model routing are observed account/provider facts and must be rechecked before use.

## Canonical execution

```text
USER / GABBY
      ↓
PROJECT INTENT
      ↓
TASK DECOMPOSITION
      ↓
CAPABILITY ROUTER
      ↓
KIMI / DEEPSEEK / GEMINI / OTHER ADAPTER
      ↓
ARTIFACT REGISTRY
      ↓
INDIVIDUAL VERIFICATION
      ↓
PROJECT-LEVEL VERIFICATION
      ↓
DELIVERY
```

## No partial-success masking

If a project requests ten artifacts and only seven are produced:

`COMPLETED = false`

The system records the seven successful artifacts and the three missing/failed artifacts. It does not report the project as complete.

## Model substitution

Provider changes must not require a Gabby command change.

Example:

`"Research this business and build the full project package."`

can route through different providers as capability, authorization, cost, latency, and availability change.

## Commercial rule

Free or unlimited claims from demonstrations are never converted into APEX truth merely because they appear in a video.

Required states:

`DISCOVERED → CONFIGURED → CAPABILITY_PROBED → TESTED → VERIFIED`

Without current execution evidence, the provider remains `UNKNOWN`, `REVIEW`, `BLOCKED`, or another appropriate truth state.

## Evidence

Primary provider references:

- Moonshot/Kimi K2.6 announcement: https://forum.moonshot.ai/t/meet-kimi-k2-6-advancing-open-source-coding/369
- Kimi current model/mode documentation: https://www.kimi.ai/help/others/model-mode-selection
- DeepSeek current pricing/model documentation: https://api-docs.deepseek.com/quick_start/pricing/
- DeepSeek V4 Pro GA announcement: https://api-docs.deepseek.com/news/news260813/

These links document provider capabilities; they do not constitute an APEX runtime connection or verification.
