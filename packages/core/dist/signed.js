// Stable stringify to ensure deterministic signatures
function stableStringify(x) {
    if (x === null || typeof x !== "object")
        return JSON.stringify(x);
    if (Array.isArray(x))
        return `[${x.map(stableStringify).join(",")}]`;
    const o = x;
    const keys = Object.keys(o).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`).join(",")}}`;
}
function opSigningPayload(op) {
    // IMPORTANT: signature must not include itself
    const unsigned = { ...op, sig: undefined };
    return new TextEncoder().encode(stableStringify(unsigned));
}
export async function signOp(crypto, op, secretKey) {
    const payload = opSigningPayload(op);
    const sig = await crypto.sign(payload, secretKey);
    return { ...op, sig: { kid: secretKey.kid, alg: "ed25519", bytes: sig } };
}
export async function verifyOp(crypto, op, publicKey) {
    if (!op.sig)
        return false;
    if (op.sig.alg !== "ed25519")
        return false;
    if (op.sig.kid !== publicKey.kid)
        return false;
    const payload = opSigningPayload(op);
    return crypto.verify(payload, op.sig.bytes, publicKey);
}
//# sourceMappingURL=signed.js.map