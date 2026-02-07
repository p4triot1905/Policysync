import test from "node:test";
import assert from "node:assert/strict";
import { utf8 } from "./index.js";
import { sodiumProvider } from "./sodium.js";

test("Ed25519 sign/verify should work", async () => {
  const c = await sodiumProvider();
  const { publicKey, secretKey } = await c.generateSigningKeypair();

  const msg = utf8("hello");
  const sig = await c.sign(msg, secretKey);
  const ok = await c.verify(msg, sig, publicKey);
  assert.equal(ok, true);

  const ok2 = await c.verify(utf8("tamper"), sig, publicKey);
  assert.equal(ok2, false);
});
