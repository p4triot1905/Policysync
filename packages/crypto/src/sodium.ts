import sodium from "libsodium-wrappers";
import type { Bytes, CryptoProvider, SigningPublicKey, SigningSecretKey } from "./index.js";

function randomKid(): string {
  // Simple key id for now (we can upgrade later)
  return `kid_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export async function sodiumProvider(): Promise<CryptoProvider> {
  await sodium.ready;

  async function generateSigningKeypair(): Promise<{
    publicKey: SigningPublicKey;
    secretKey: SigningSecretKey;
  }> {
    const kp = sodium.crypto_sign_keypair();
    const kid = randomKid();
    return {
      publicKey: { kid, bytes: new Uint8Array(kp.publicKey) },
      secretKey: { kid, bytes: new Uint8Array(kp.privateKey) },
    };
  }

  async function sign(message: Bytes, secretKey: SigningSecretKey): Promise<Bytes> {
    const sig = sodium.crypto_sign_detached(message, secretKey.bytes);
    return new Uint8Array(sig);
  }

  async function verify(message: Bytes, signature: Bytes, publicKey: SigningPublicKey): Promise<boolean> {
    return sodium.crypto_sign_verify_detached(signature, message, publicKey.bytes);
  }

  async function hash(message: Bytes): Promise<Bytes> {
    // Use SHA-256 from libsodium
    const out = sodium.crypto_hash_sha256(message);
    return new Uint8Array(out);
  }

  return { generateSigningKeypair, sign, verify, hash };
}
