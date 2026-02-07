import type { ActorId, HLC } from "./index.js";
export type EntityName = string;
export type EntityId = string;
export type Op = {
    id: string;
    actor: ActorId;
    ts: HLC;
    entity: EntityName;
    entityId: EntityId;
    path: string;
    kind: "lww_set";
    value: unknown;
};
export declare function opId(actor: ActorId, ts: HLC): string;
//# sourceMappingURL=op.d.ts.map