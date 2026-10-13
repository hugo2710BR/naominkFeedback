import type { RateLimitRule, RateLimitScope } from "@/types";

/**
 * Limites por IP. Folgados o suficiente para um cliente real (várias fotos,
 * enganos na palavra-passe), apertados o suficiente para travar spam e
 * tentativas de adivinhar a palavra-passe do admin.
 */
export const RATE_LIMITS: Record<RateLimitScope, RateLimitRule> = {
  // Cada envio de foto começa num /presign.
  upload: { limit: 15, windowSeconds: 60 * 60 },
  "upload-abort": { limit: 30, windowSeconds: 60 * 60 },
  "admin-login": { limit: 5, windowSeconds: 15 * 60 },
};

export const RATE_LIMIT_MESSAGES: Record<RateLimitScope, string> = {
  upload: "Enviaste muitas fotografias seguidas. Tenta novamente daqui a pouco.",
  "upload-abort": "Demasiados pedidos. Tenta novamente daqui a pouco.",
  "admin-login": "Demasiadas tentativas. Aguarda 15 minutos e tenta novamente.",
};
