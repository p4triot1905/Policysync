import { OpLog, hlcNow, signOp, verifyOp, opId } from "@policysync/core";
import { sodiumProvider } from "@policysync/crypto";

console.log("DEMO START");

async function main() {
  // One crypto provider instance is enough for verification.
  // The important part is checking against the correct public keys.
  const crypto = await sodiumProvider();

  const { publicKey: pubA, secretKey: secA } = await crypto.generateSigningKeypair();
  const { publicKey: pubB, secretKey: secB } = await crypto.generateSigningKeypair();

  const log = new OpLog({
    guard: async (op) => {
      if (await verifyOp(crypto, op, pubA)) return true;
      if (await verifyOp(crypto, op, pubB)) return true;
      return false;
    },
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
    kind: "lww_set" as const,
    value: "Hello from A",
  };

  const signedA = await signOp(crypto, opA, secA);
  console.log("ADD A =", await log.add(signedA));

  // Actor B creates a later op
  const tsB = hlcNow("B", tsA);
  const opB = {
    id: opId("B", tsB),
    actor: "B",
    ts: tsB,
    entity: "Task",
    entityId: "t1",
    path: "title",
    kind: "lww_set" as const,
    value: "Hello from B",
  };

  const signedB = await signOp(crypto, opB, secB);
  console.log("ADD B =", await log.add(signedB));

  console.log("Merged ops:");
  for (const op of log.all()) {
    console.log(op.actor, "→", op.value);
  }

  console.log("DEMO END");
}

main().catch(console.error);
