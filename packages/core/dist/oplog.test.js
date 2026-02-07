import test from "node:test";
import assert from "node:assert/strict";
import { hlcNow } from "./index.js";
import { OpLog } from "./oplog.js";
import { opId } from "./op.js";
test("OpLog should deduplicate and order ops deterministically", () => {
    const log = new OpLog();
    const ts1 = hlcNow("A");
    const ts2 = hlcNow("A", ts1);
    const op1 = {
        id: opId("A", ts1),
        actor: "A",
        ts: ts1,
        entity: "Task",
        entityId: "t1",
        path: "title",
        kind: "lww_set",
        value: "first",
    };
    const op2 = {
        id: opId("A", ts2),
        actor: "A",
        ts: ts2,
        entity: "Task",
        entityId: "t1",
        path: "title",
        kind: "lww_set",
        value: "second",
    };
    assert.equal(log.add(op2), true);
    assert.equal(log.add(op1), true);
    assert.equal(log.add(op1), false); // duplicate
    const all = log.all();
    assert.equal(all.length, 2);
    assert.equal(all[0].value, "first");
    assert.equal(all[1].value, "second");
});
//# sourceMappingURL=oplog.test.js.map