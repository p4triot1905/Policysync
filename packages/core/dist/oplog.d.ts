import { type HLC } from "./index.js";
import type { Op } from "./op.js";
export type OpGuard = (op: Op) => boolean | Promise<boolean>;
export declare class OpLog {
    private ops;
    private seen;
    private guard?;
    constructor(opts?: {
        guard?: OpGuard;
    });
    add(op: Op): Promise<boolean>;
    all(): Op[];
    since(ts?: HLC): Op[];
}
//# sourceMappingURL=oplog.d.ts.map