import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) throw new Error("ENCRYPTION_KEY is missing");

  // If your string is 64 characters of Hex, it equals 32 bytes.
  // We must tell Buffer to parse it as 'hex'.
  const keyBuffer = Buffer.from(key, "hex");

  if (keyBuffer.length !== 32) {
    throw new Error(
      `Invalid key length: Expected 32 bytes, got ${keyBuffer.length}. (64 hex characters = 32 bytes)`,
    );
  }

  return keyBuffer;
};

export function encryptObject(data: object): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv, {
    authTagLength: TAG_LENGTH,
  });
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((b) => b.toString("base64url"))
    .join(".");
}

export function decryptObject<T>(token: string): T {
  const [ivB64, tagB64, dataB64] = token.split(".");
  if (!ivB64 || !tagB64 || !dataB64) throw new Error("Malformed token");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivB64, "base64url"),
    { authTagLength: TAG_LENGTH },
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf8")) as T;
}
