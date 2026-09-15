# Sintra AI — APEX Capability Inventory & Execution Map

**Status:** ACTIVE INVENTORY / FIELD-TEST PLAN  
**Owner:** APEX  
**Command layer:** APEX TERMINAL  
**Workforce layer:** Sintra AI  
**Primary coordinator:** Gabby / APEX orchestration

## 1. What Sintra is

Sintra is an AI workforce platform built around:
- Brain AI knowledge/context
- Specialized AI employees/helpers
- Team Chat with a coordinating Team Leader
- Integrations
- Automations
- Recurring/scheduled tasks
- Helper use-cases/skills
- Website Builder
- Marketplace/custom AI employees
- Image generation/editing
- Meeting Notetaker
- Searchable chat/history

## 2. Built-in AI workforce

Current official documentation identifies these core helpers:
- Soshie — Social Media Manager
- Penn — Copywriter
- Emmie — Email Marketer
- Milli — Sales Strategist / Manager
- Cassie — Customer Support
- Dexter — Data Analyst
- Buddy — Business Strategist
- Seomi — SEO Specialist
- Vizzy — Executive Assistant
- Commet — E-commerce & Web Builder
- Gigi — Personal Coach
- Scouty — Recruiter

Sintra also supports custom AI employees and marketplace employees.

## 3. Core APEX use

Sintra is NOT the APEX owner or canonical system. It is a replaceable workforce/implementation provider.

APEX Terminal should remain the command/control layer.

Gabby should delegate work to the appropriate Sintra helper when Sintra is the best execution surface.

## 4. Brain AI

Use Brain AI for:
- APEX business context
- Brand guidelines/tone
- Product/service information
- Website content/FAQs
- Documents
- Reusable snippets/instructions
- Images/visual assets
- Structured knowledge
- Persistent project context

Workspace separation must be respected. Do not accidentally mix unrelated APEX applications/brands.

## 5. Team Chat / delegation

Use Team Chat when a request spans multiple specialties.

Example:
1. Gabby receives objective.
2. Team Leader plans/delegates.
3. Specialist helpers execute their portions.
4. Results are consolidated.
5. APEX validates the result.
6. Approved output moves to the correct APEX module/repository/system.

## 6. Integrations

Sintra currently documents 1,000+ integrations powered by Composio.

Important APEX candidates include:
- Gmail
- Outlook
- Google Calendar
- Microsoft Calendar
- Google Drive
- Dropbox
- Notion
- Slack
- GitHub
- Linear
- Shopify
- TikTok
- YouTube
- LinkedIn
- Instagram
- Facebook / Meta
- Meta Ads
- WordPress
- Webflow
- HubSpot
- Salesforce
- Trello
- Todoist
- Google Tasks
- Google Analytics
- QuickBooks
- Strava
- Microsoft services

**Rule:** inventory what is actually available in the user's Sintra account before declaring an integration connected or operational.

## 7. Automations

Use automations for background work such as:
- social posting workflows
- inbox management
- daily summaries
- comment handling
- recurring operational routines
- scheduled content
- event-triggered actions

Important limitation documented by Sintra: complex multi-step chained workflows are not currently supported as a native automation primitive. Do not design APEX around an unsupported capability.

## 8. Recurring tasks

Use recurring tasks for:
- daily briefings
- weekly reports
- hourly checks
- scheduled content operations
- recurring research
- operational reminders

Sintra documentation says recurring tasks can run as often as every 10 minutes.

## 9. Website Builder

Use Commet / Website Builder for:
- new sites
- page changes
- promotions
- listing optimization
- publishing to Sintra hosting or a custom domain

APEX canonical website specifications remain outside Sintra.

## 10. E-commerce

Use Commet plus Shopify integration for:
- product/listing work
- e-commerce operations
- catalog-related tasks
- promotion planning
- listing optimization

Do not let a helper silently alter production commerce data without an explicit APEX-approved action.

## 11. Marketing / social

Soshie + social integrations can be used for:
- post creation
- scheduling
- engagement tracking
- platform publishing
- comment workflows
- content-calendar operations

Penn supports copywriting and tone refinement.

Seomi supports SEO/keyword/page optimization.

Emmie supports email campaigns.

## 12. Sales / customer operations

Milli:
- sales scripts
- leads
- sales follow-up
- closing support

Cassie:
- customer responses
- support workflows
- ticket handling

Vizzy:
- scheduling
- prioritization
- summaries
- executive assistance

## 13. Data / intelligence

Dexter:
- data analysis
- reporting
- trend analysis
- structured insights

Use APEX validation/audit systems for consequential decisions.

## 14. Recruiting

Scouty:
- job ads
- candidate screening
- hiring workflow support

Human approval remains required for consequential employment decisions.

## 15. Image / content production

Sintra documents:
- image generation
- image editing
- content-calendar image editing

Use this for production assistance, but preserve APEX's canonical brand/creative specifications outside the provider.

## 16. Meeting Notetaker

Use Meeting Notetaker where connected and authorized to:
- capture meetings
- summarize discussions
- extract action items
- feed approved knowledge back into the appropriate workspace/system

## 17. Marketplace / custom helpers

Sintra supports:
- community marketplace helpers
- custom AI employees
- custom rules/personas
- reusable skills

APEX should evaluate each custom/marketplace helper before granting it access to business systems.

## 18. API status

**Critical finding:** Sintra's current official integration documentation explicitly says Sintra does NOT provide a public API.

Therefore:
- Do not design an APEX dependency on a nonexistent Sintra API.
- Use Sintra's native integrations and supported workflows.
- If APEX needs an external API/orchestration path, keep that layer outside Sintra.
- Treat Sintra as a replaceable execution/workforce provider.

## 19. APEX execution model

COMMAND
→ APEX TERMINAL
→ GABBY
→ ROUTE TO BEST EXECUTION PROVIDER
→ SINTRA HELPER / CONNECTED APP / OTHER TOOL
→ VALIDATE
→ RETURN RESULT
→ STORE CANONICAL RESULT IN APEX

Sintra is a worker, not the sovereign source of truth.

## 20. Tomorrow's Sintra field test

Run the inventory against the actual paid Sintra workspace and mark every capability:

[ ] Available
[ ] Connected
[ ] Authenticated
[ ] Tested
[ ] Produces expected output
[ ] Safe for production
[ ] APEX route documented

Test every built-in helper, Team Chat, Brain AI, integrations, automations, recurring tasks, website builder, marketplace/custom-helper path, image generation/editing, meeting notes, and relevant helper use-cases.

For integrations, enumerate the actual connectors visible in the user's account rather than assuming every advertised connector is enabled.

## 21. Evidence standard

For every capability tested, record:
- capability name
- Sintra workspace
- helper/feature
- connected service
- permission/scope
- exact test
- result
- evidence/screenshot or URL
- production status
- APEX destination
- rollback/disconnect path
- known limitation

## 22. Non-negotiable architecture rule

Sintra can execute.

APEX defines what is true.

Gabby coordinates.

APEX Terminal commands.

Connected providers are replaceable.

No provider becomes a permanent architectural owner merely because it is convenient today.
