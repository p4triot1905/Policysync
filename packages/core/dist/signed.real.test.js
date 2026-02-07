import test from "node:test";
import assert from "node:assert/strict";
import { sodiumProvider } from "@policysync/crypto";
import { hlcNow } from "./index.js";
import { opId } from "./op.js";
import { signOp, verifyOp } from "./signed.js";
test("Op signing should detect tampering (real sodium)", async () => {
    const c = await sodiumProvider();
    const { publicKey, secretKey } = await c.generateSigningKeypair();
    const ts = hlcNow("A");
    const op = {
        id: opId("A", ts),
        actor: "A",
        ts,
        entity: "Task",
        entityId: "t1",
        path: "title",
        kind: "lww_set",
        value: "hello",
    };
    const signed = await signOp(c, op, secretKey);
    assert.ok(signed.sig);
    const ok = await verifyOp(c, signed, publicKey);
    assert.equal(ok, true);
    const tampered = { ...signed, value: "hacked" };
    const ok2 = await verifyOp(c, tampered, publicKey);
    assert.equal(ok2, false);
});
//# sourceMappingURL=signed.real.test.js.map