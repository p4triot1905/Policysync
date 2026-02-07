import { hlcCompare, type HLC } from "./index.js";
import type { Op } from "./op.js";

// A minimal in-memory oplog that keeps ops sorted deterministically.
export class OpLog {
  private ops: Op[] = [];
  private seen = new Set<string>();

  add(op: Op): boolean {
    // Deduplicate by op id
    if (this.seen.has(op.id)) return false;
    this.seen.add(op.id);
    this.ops.push(op);

    // Keep a deterministic order (ts + actor is already inside HLC)
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
