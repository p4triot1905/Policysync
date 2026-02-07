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
    verify(message: Bytes, signature: Bytes, publicKey: SigningPublicKey): Promise<boolean>;
    hash(message: Bytes): Promise<Bytes>;
};
export declare function utf8(s: string): Bytes;
export declare function bytesEqual(a: Bytes, b: Bytes): boolean;
export declare function webCryptoProvider(): CryptoProvider;
//# sourceMappingURL=index.d.ts.map