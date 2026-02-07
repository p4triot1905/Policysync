# PolicySync

**PolicySync** is a secure, offline-first synchronization core for distributed applications.

It is designed for systems where:
- devices must work offline,
- data must merge deterministically,
- every change must be attributable to a cryptographic identity,
- untrusted storage or transport is assumed.

PolicySync is **not a database** and **not a server**.  
It is a **synchronization engine** you embed into your own applications.

---

## Why PolicySync?

Most synchronization systems assume:
- always-online connectivity,
- trusted servers,
- last-write-wins without provenance.

PolicySync assumes the opposite.

**Core principles:**
- **Local-first**: everything works offline.
- **Append-only**: changes are immutable operations.
- **Deterministic merge**: no conflicts, no heuristics.
- **Signed operations**: every change is cryptographically verifiable.
- **Untrusted transport**: storage and servers may lie.

---

## Core Concepts

### Operations (Ops)

Every change is represented as an immutable operation:

```ts
type Op = {
  id: string;
  actor: string;
  ts: HLC;
  entity: string;
  entityId: string;
  path: string;
  kind: "lww_set";
  value: unknown;
  sig?: Signature;
};

Operations are;
append-only
ordered deterministically
cryptographically signed

Hybrid Logical Clock (HLC)
PolicySync uses Hybrid Logical Clocks to guarantee:
monotonic timestamps,
deterministic ordering across devices,
no reliance on synchronized system clocks.

OpLog
The OpLog is an append-only log that:
deduplicates operations,
orders them deterministically,
optionally enforces verification and policy checks
const log = new OpLog({
  guard: (op) => verifyOp(crypto, op, publicKey),
});
If verification fails, the operation is rejected.

Cryptographic Model
PolicySync uses:
Ed25519 for signing and verification,
SHA-256 for hashing,
libsodium as the reference crypto backend.
Security properties:
tampering is detectable,
replayed or modified operations are rejected,
identity is bound to every operation.

Installation 
pnpm add @policysync/core @policysync/crypto

Quick start

import { OpLog, hlcNow, signOp, verifyOp } from "@policysync/core";
import { sodiumProvider } from "@policysync/crypto";

const crypto = await sodiumProvider();
const { publicKey, secretKey } = await crypto.generateSigningKeypair();

const log = new OpLog({
  guard: (op) => verifyOp(crypto, op, publicKey),
});

const ts = hlcNow("alice");

const op = {
  id: "alice:1",
  actor: "alice",
  ts,
  entity: "Task",
  entityId: "t1",
  path: "title",
  kind: "lww_set",
  value: "Hello world",
};

const signed = await signOp(crypto, op, secretKey);
await log.add(signed);

Threat Model
PolicySync assumes:
storage may be malicious,
transport may be intercepted,
peers may replay or reorder data.
PolicySync guarantees:
tampered data is rejected,
unsigned data is rejected,
ordering is deterministic,
identity is cryptographically bound.
PolicySync does not:
provide anonymity,
hide metadata,
encrypt payloads (yet),
manage key distribution for you.

What PolicySync Is NOT
❌ Not a database
❌ Not a CRDT UI framework
❌ Not a server
❌ Not a consensus system
PolicySync is a low-level synchronization primitive, not a platform.

Project Status
V1 – Stable Secure Core
deterministic merge ✔
append-only OpLog ✔
signed operations ✔
verification guard ✔
full test coverage ✔
Planned (V1.x / V2):
payload encryption (XChaCha20-Poly1305)
key rotation
policy DSL
transport adapters (HTTP / WebSocket)
IndexedDB storage adapter

License:
MIT