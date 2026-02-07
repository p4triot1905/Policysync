import { hlcCompare } from "./index.js";
// A minimal in-memory oplog that keeps ops sorted deterministically.
export class OpLog {
    ops = [];
    seen = new Set();
    add(op) {
        // Deduplicate by op id
        if (this.seen.has(op.id))
            return false;
        this.seen.add(op.id);
        this.ops.push(op);
        // Keep a deterministic order (ts + actor is already inside HLC)
        this.ops.sort((a, b) => hlcCompare(a.ts, b.ts));
        return true;
    }
    all() {
        return [...this.ops];
    }
    since(ts) {
        if (!ts)
            return this.all();
        return this.ops.filter((o) => hlcCompare(o.ts, ts) > 0);
    }
}
//# sourceMappingURL=oplog.js.map