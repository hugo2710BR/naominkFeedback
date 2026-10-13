import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "naomink_admin_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

/** Tolerância para relógios ligeiramente dessincronizados entre instâncias. */
const CLOCK_SKEW_SECONDS = 60;

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Token = `admin:<emitido-em>:<nonce>.<hmac>`. A assinatura usa a
 * ADMIN_PASSWORD como segredo, por isso mudar a palavra-passe invalida
 * todas as sessões abertas.
 */
export function createAdminSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const payload = `admin:${nowSeconds()}:${randomBytes(16).toString("hex")}`;
  return `${payload}.${sign(payload, secret)}`;
}

function isValidToken(token: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expectedBuf = Buffer.from(sign(payload, secret), "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
    return false;
  }

  // A assinatura só prova que fomos nós a emitir o token; a validade é
  // verificada aqui — não basta confiar no maxAge do cookie, que o
  // browser (ou quem copiar o cookie) pode ignorar.
  const [subject, issuedAtRaw] = payload.split(":");
  const issuedAt = Number(issuedAtRaw);
  if (subject !== "admin" || !Number.isInteger(issuedAt)) return false;

  const age = nowSeconds() - issuedAt;
  return age >= -CLOCK_SKEW_SECONDS && age <= SESSION_MAX_AGE_SECONDS;
}

export async function isAdminAuthed(): Promise<boolean> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  return isValidToken(token);
}

/** Compara via hash para o tempo de resposta não revelar o comprimento da palavra-passe. */
export function verifyAdminPassword(candidate: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const candidateHash = createHash("sha256").update(candidate).digest();
  const secretHash = createHash("sha256").update(secret).digest();
  return timingSafeEqual(candidateHash, secretHash);
}
