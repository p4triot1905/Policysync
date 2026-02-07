import { hlcCompare, type HLC } from "./index.js";
import type { Op } from "./op.js";

export type OpGuard = (op: Op) => boolean | Promise<boolean>;

// A minimal in-memory oplog that keeps ops sorted deterministically.
export class OpLog {
  private ops: Op[] = [];
  private seen = new Set<string>();
  private guard?: OpGuard;

  constructor(opts?: { guard?: OpGuard }) {
    this.guard = opts?.guard;
  }

  async add(op: Op): Promise<boolean> {
    // Optional verification / policy guard
    if (this.guard) {
      const ok = await this.guard(op);
      if (!ok) return false;
    }

    // Deduplicate by op id
    if (this.seen.has(op.id)) return false;
    this.seen.add(op.id);
    this.ops.push(op);

    // Keep a deterministic order
    this.ops.sort((a, b) => hlcCompare(a.ts, b.ts));
    return true;
  }

  all(): Op[] {
    return [...this.ops];
  }

  since(ts?: HLC): Op[] {
    if (!ts) return this.all();
    return this.ops.filter((o) => hlcCompare(o.ts, ts) > 0);
  }
}
