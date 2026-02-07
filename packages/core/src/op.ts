import type { ActorId, HLC } from "./index.js";

export type EntityName = string;
export type EntityId = string;

// A single operation is an immutable fact that can be replicated and merged.
export type Op = {
  // Unique operation id (deterministic: actor + hlc)
  id: string;

  // Who created this op
  actor: ActorId;

  // When the op happened (HLC)
  ts: HLC;

  // Target entity
  entity: EntityName;
  entityId: EntityId;

  // What is being changed (field-level path)
  path: string;

  // Operation kind (we will expand this later)
  kind: "lww_set";

  // Value for the operation (JSON-serializable)
  value: unknown;

  // Signature over the canonical op payload (optional, for signed ops)
  sig?: {
    kid: string;
    alg: "ed25519";
    bytes: Uint8Array;
  };
};

export function opId(actor: ActorId, ts: HLC): string {
  // Stable op id format
  return `${actor}:${ts.t}:${ts.c}`;
}
