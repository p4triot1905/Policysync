import test from "node:test";
import assert from "node:assert/strict";
import { sodiumProvider } from "@policysync/crypto";
import { hlcNow } from "./index.js";
import { OpLog } from "./oplog.js";
import { opId } from "./op.js";
import { signOp, verifyOp } from "./signed.js";
test("OpLog guard should reject unsigned or tampered ops", async () => {
    const crypto = await sodiumProvider();
    const { publicKey, secretKey } = await crypto.generateSigningKeypair();
    const log = new OpLog({
        guard: (op) => verifyOp(crypto, op, publicKey),
    });
    const ts = hlcNow("A");
    const baseOp = {
        id: opId("A", ts),
        actor: "A",
        ts,
        entity: "Task",
        entityId: "t1",
        path: "title",
        kind: "lww_set",
        value: "hello",
    };
    // Unsigned should be rejected
    assert.equal(await log.add(baseOp), false);
    // Signed should be accepted
    const signed = await signOp(crypto, baseOp, secretKey);
    assert.equal(await log.add(signed), true);
    // Tampered should be rejected
    const tampered = { ...signed, value: "hacked" };
    assert.equal(await log.add(tampered), false);
    // Only one op should be in the log
    assert.equal(log.all().length, 1);
});
//# sourceMappingURL=oplog.guard.test.js.map