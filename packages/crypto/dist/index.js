export function utf8(s) {
    return new TextEncoder().encode(s);
}
export function bytesEqual(a, b) {
    if (a.length !== b.length)
        return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b[i];
    return diff === 0;
}
export function webCryptoProvider() {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) {
        throw new Error("WebCrypto is not available");
    }
    async function hash(message) {
        // IMPORTANT: pass ArrayBuffer, not Uint8Array directly
        const ab = message.slice().buffer; // Ensure a standalone ArrayBuffer (not SharedArrayBuffer)
        const out = await subtle.digest("SHA-256", ab);
        return new Uint8Array(out);
    }
    async function generateSigningKeypair() {
        throw new Error("Signing not implemented yet (intentional)");
    }
    async function sign() {
        throw new Error("Signing not implemented yet");
    }
    async function verify() {
        throw new Error("Verify not implemented yet");
    }
    return {
        generateSigningKeypair,
        sign,
        verify,
        hash,
    };
}
export * from "./sodium.js";
//# sourceMappingURL=index.js.map