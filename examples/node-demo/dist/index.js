import { OpLog, hlcNow, signOp, verifyOp } from "@policysync/core";
import { sodiumProvider } from "@policysync/crypto";
import { opId } from "@policysync/core";
async function main() {
    const cryptoA = await sodiumProvider();
    const cryptoB = await sodiumProvider();
    const { publicKey: pubA, secretKey: secA } = await cryptoA.generateSigningKeypair();
    const { publicKey: pubB, secretKey: secB } = await cryptoB.generateSigningKeypair();
    const log = new OpLog({
        guard: (op) => verifyOp(cryptoA, op, pubA) || verifyOp(cryptoB, op, pubB),
    });
    // Actor A creates an op
    const tsA = hlcNow("A");
    const opA = {
        id: opId("A", tsA),
        actor: "A",
        ts: tsA,
        entity: "Task",
        entityId: "t1",
        path: "title",
        kind: "lww_set",
        value: "Hello from A",
    };
    const signedA = await signOp(cryptoA, opA, secA);
    await log.add(signedA);
    // Actor B creates a later op
    const tsB = hlcNow("B", tsA);
    const opB = {
        id: opId("B", tsB),
        actor: "B",
        ts: tsB,
        entity: "Task",
        entityId: "t1",
        path: "title",
        kind: "lww_set",
        value: "Hello from B",
    };
    const signedB = await signOp(cryptoB, opB, secB);
    await log.add(signedB);
    console.log("Merged ops:");
    for (const op of log.all()) {
        console.log(op.actor, "→", op.value);
    }
}
main().catch(console.error);
