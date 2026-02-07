export type Bytes = Uint8Array;
export type KeyId = string;

export type SigningPublicKey = {
  kid: KeyId;
  bytes: Bytes;
};

export type SigningSecretKey = {
  kid: KeyId;
  bytes: Bytes;
};

export type CryptoProvider = {
  generateSigningKeypair(): Promise<{
    publicKey: SigningPublicKey;
    secretKey: SigningSecretKey;
  }>;
  sign(message: Bytes, secretKey: SigningSecretKey): Promise<Bytes>;
  verify(
    message: Bytes,
    signature: Bytes,
    publicKey: SigningPublicKey
  ): Promise<boolean>;
  hash(message: Bytes): Promise<Bytes>;
};

export function utf8(s: string): Bytes {
  return new TextEncoder().encode(s);
}

export function bytesEqual(a: Bytes, b: Bytes): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function webCryptoProvider(): CryptoProvider {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("WebCrypto is not available");
  }

  async function hash(message: Bytes): Promise<Bytes> {
    // IMPORTANT: pass ArrayBuffer, not Uint8Array directly
    const ab = message.slice().buffer; // Ensure a standalone ArrayBuffer (not SharedArrayBuffer)
const out = await subtle.digest("SHA-256", ab);
    return new Uint8Array(out);
  }

  async function generateSigningKeypair(): Promise<{
    publicKey: SigningPublicKey;
    secretKey: SigningSecretKey;
  }> {
    throw new Error("Signing not implemented yet (intentional)");
  }

  async function sign(): Promise<Bytes> {
    throw new Error("Signing not implemented yet");
  }

  async function verify(): Promise<boolean> {
    throw new Error("Verify not implemented yet");
  }

  return {
    generateSigningKeypair,
    sign,
    verify,
    hash,
  };
}
