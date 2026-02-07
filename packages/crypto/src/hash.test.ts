import test from "node:test";
import assert from "node:assert/strict";
import { webCryptoProvider, utf8 } from "./index.js";

test("hash should be deterministic", async () => {
  const c = webCryptoProvider();
  const a = await c.hash(utf8("hello"));
  const b = await c.hash(utf8("hello"));
  assert.equal(a.length, 32);
  assert.deepEqual(Array.from(a), Array.from(b));
});
