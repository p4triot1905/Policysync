import sodium from "libsodium-wrappers";
function randomKid() {
    // Simple key id for now (we can upgrade later)
    return `kid_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
export async function sodiumProvider() {
    await sodium.ready;
    async function generateSigningKeypair() {
        const kp = sodium.crypto_sign_keypair();
        const kid = randomKid();
        return {
            publicKey: { kid, bytes: new Uint8Array(kp.publicKey) },
            secretKey: { kid, bytes: new Uint8Array(kp.privateKey) },
        };
    }
    async function sign(message, secretKey) {
        const sig = sodium.crypto_sign_detached(message, secretKey.bytes);
        return new Uint8Array(sig);
    }
    async function verify(message, signature, publicKey) {
        return sodium.crypto_sign_verify_detached(signature, message, publicKey.bytes);
    }
    async function hash(message) {
        // Use SHA-256 from libsodium
        const out = sodium.crypto_hash_sha256(message);
        return new Uint8Array(out);
    }
    return { generateSigningKeypair, sign, verify, hash };
}
//# sourceMappingURL=sodium.js.map