# APEX REAL-TIME ENGINE v1

## Role

The Real-Time Engine is the execution fabric behind APEX TERMINAL.

It builds, runs, observes, verifies, and reports applications, games, creative assets, and infrastructure workflows without pretending an action succeeded when it did not.

## Core topology

```text
APEX TERMINAL
    |
    v
COMMAND / WORKFLOW API
    |
    +--> AUTHORIZATION + POLICY
    |
    +--> WORKFLOW PLANNER
    |
    +--> ENGINE ROUTER
            |
            +--> BLENDER ADAPTER
            +--> UNREAL ADAPTER
            +--> TRIPO AI ADAPTER
            +--> WEB/APP BUILD ADAPTER
            +--> GAME BUILD ADAPTER
            +--> GITHUB ADAPTER
            +--> CLOUD/DEPLOY ADAPTER
    |
    v
EVENT BUS / STREAM
    |
    +--> LIVE AUDIT FEED
    +--> LOGS
    +--> METRICS
    +--> ARTIFACT REGISTRY
    +--> EVIDENCE LEDGER
    |
    v
TRUTH / VERIFICATION
```

## Universal engine contract

Every adapter implements the same lifecycle:

```text
initialize
validate
plan
execute
monitor
report
verify
recover
shutdown
```

## Engine identity

Every execution receives:

- `execution_id`
- `correlation_id`
- `project_id`
- `repository`
- `engine`
- `requested_action`
- `policy`
- `actor`
- `created_at`

## Event contract

Examples:

```text
ExecutionRequested
ExecutionAuthorized
ExecutionStarted
ExecutionProgress
ArtifactCreated
BuildStarted
BuildSucceeded
BuildFailed
VerificationStarted
VerificationPassed
VerificationFailed
ExecutionRecovered
ExecutionBlocked
ExecutionCompleted
```

Every event is persisted or durably forwarded according to the configured event-store policy.

## Truth contract

Operational state and truth state are separate.

Operational states:

`QUEUED | RUNNING | SUCCEEDED | FAILED | RETRYING | BLOCKED | CANCELLED`

Truth states:

`VERIFIED | UNVERIFIED | CONFLICTING | OUTDATED`

A successful process exit does not automatically mean `VERIFIED`.

## Blender

Blender is treated as a real external engine. The adapter must verify:

1. Blender executable/version.
2. Project/file exists.
3. Requested script is authorized.
4. Process exits with expected status.
5. Expected artifact exists.
6. Artifact checksum/read-back succeeds where required.

## Unreal Engine

Unreal is treated as a real external engine. The adapter must verify:

1. Engine/project path.
2. Build/cook/package command.
3. Process exit code.
4. Expected build artifact.
5. Automated test result where configured.
6. Artifact/read-back integrity.

## Tripo AI

Tripo AI is an integration target, not a claimed connection. The adapter must require a credential reference and configured endpoint, then record request ID, output asset ID, download/read-back result, and verification evidence.

No API key belongs in source code, browser state, logs, or the audit feed.

## Application/game builders

The same contract applies to web, mobile, desktop, and game workflows. The engine does not hard-code one technology stack into the control plane.

## Real-time requirement

The user interface must receive actual lifecycle events rather than polling a fabricated local array.

Minimum path:

```text
USER COMMAND
  -> authenticated API
  -> workflow ID
  -> real execution
  -> event stream
  -> UI update
  -> persisted result
  -> read-back verification
```

## Security boundary

The browser never receives arbitrary shell access or raw provider secrets. Commands are translated into approved workflows and executed by a privileged backend runner subject to policy, authorization, timeouts, resource limits, and audit logging.

## Completion gate

An engine integration is only `VERIFIED` after a real test produces:

- execution ID
- command/workflow
- actual runtime result
- artifact or destination evidence
- verification result
- persisted audit record

Otherwise the status remains `UNVERIFIED`, `BLOCKED`, `FAILED`, or `NOT COMPLETE`.
