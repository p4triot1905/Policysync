import { hlcCompare } from "./index.js";
// A minimal in-memory oplog that keeps ops sorted deterministically.
export class OpLog {
    ops = [];
    seen = new Set();
    guard;
    constructor(opts) {
        this.guard = opts?.guard;
    }
    async add(op) {
        // Optional verification / policy guard
        if (this.guard) {
            const ok = await this.guard(op);
            if (!ok)
                return false;
        }
        // Deduplicate by op id
        if (this.seen.has(op.id))
            return false;
        this.seen.add(op.id);
        this.ops.push(op);
        // Keep a deterministic order
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