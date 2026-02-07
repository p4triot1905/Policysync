export type ActorId = string;

export type HLC = {
  // Hybrid Logical Clock: physical time + logical counter
  t: number;
  c: number;
  a: ActorId;
};

export function hlcNow(actorId: ActorId, last?: HLC): HLC {
  // Create a monotonic timestamp even if the system clock moves backward
  const now = Date.now();
  if (!last) return { t: now, c: 0, a: actorId };
  if (now > last.t) return { t: now, c: 0, a: actorId };
  return { t: last.t, c: last.c + 1, a: actorId };
}

export function hlcCompare(x: HLC, y: HLC): number {
  // Deterministic ordering: time, counter, actor id
  if (x.t !== y.t) return x.t < y.t ? -1 : 1;
  if (x.c !== y.c) return x.c < y.c ? -1 : 1;
  if (x.a !== y.a) return x.a < y.a ? -1 : 1;
  return 0;
}

export type LWW<T> = {
  // Last-Write-Wins register (simple CRDT)
  v: T;
  ts: HLC;
};

export function lwwSet<T>(cur: LWW<T> | undefined, next: LWW<T>): LWW<T> {
  // Apply LWW rule deterministically
  if (!cur) return next;
  return hlcCompare(cur.ts, next.ts) >= 0 ? cur : next;
}

export type Task = {
  id: string;
  title: LWW<string>;
};

export class InMemoryStore {
  private tasks = new Map<string, Task>();

  upsertTask(id: string, title: LWW<string>) {
    const cur = this.tasks.get(id);
    const mergedTitle = lwwSet(cur?.title, title);
    this.tasks.set(id, { id, title: mergedTitle });
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }
}
export * from "./op.js";
export * from "./oplog.js";
export * from "./signed.js";
