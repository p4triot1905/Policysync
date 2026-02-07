import { type HLC } from "./index.js";
import type { Op } from "./op.js";
export declare class OpLog {
    private ops;
    private seen;
    add(op: Op): boolean;
    all(): Op[];
    since(ts?: HLC): Op[];
}
//# sourceMappingURL=oplog.d.ts.map