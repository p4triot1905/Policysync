import type { CryptoProvider, SigningPublicKey, SigningSecretKey } from "@policysync/crypto";
import type { Op } from "./op.js";

// Stable stringify to ensure deterministic signatures
function stableStringify(x: unknown): string {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(stableStringify).join(",")}]`;
  const o = x as Record<string, unknown>;
  const keys = Object.keys(o).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`).join(",")}}`;
}

function opSigningPayload(op: Op): Uint8Array {
  // IMPORTANT: signature must not include itself
  const unsigned = { ...op, sig: undefined };
  return new TextEncoder().encode(stableStringify(unsigned));
}

export async function signOp(
  crypto: CryptoProvider,
  op: Op,
  secretKey: SigningSecretKey
): Promise<Op> {
  const payload = opSigningPayload(op);
  const sig = await crypto.sign(payload, secretKey);
  return { ...op, sig: { kid: secretKey.kid, alg: "ed25519", bytes: sig } };
}

export async function verifyOp(
  crypto: CryptoProvider,
  op: Op,
  publicKey: SigningPublicKey
): Promise<boolean> {
  if (!op.sig) return false;
  if (op.sig.alg !== "ed25519") return false;
  if (op.sig.kid !== publicKey.kid) return false;
  const payload = opSigningPayload(op);
  return crypto.verify(payload, op.sig.bytes, publicKey);
}
