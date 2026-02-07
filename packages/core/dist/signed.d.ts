import type { CryptoProvider, SigningPublicKey, SigningSecretKey } from "@policysync/crypto";
import type { Op } from "./op.js";
export declare function signOp(crypto: CryptoProvider, op: Op, secretKey: SigningSecretKey): Promise<Op>;
export declare function verifyOp(crypto: CryptoProvider, op: Op, publicKey: SigningPublicKey): Promise<boolean>;
//# sourceMappingURL=signed.d.ts.map