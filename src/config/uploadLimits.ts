export const MAX_THUMB_BYTES = 300 * 1024;
export const MAX_WEB_BYTES = 2 * 1024 * 1024;
export const MAX_ORIGINAL_BYTES = 30 * 1024 * 1024;

export const MAX_NAME_LENGTH = 60;
export const MAX_MESSAGE_LENGTH = 280;

/**
 * Tem de ser exatamente igual nos cabeçalhos assinados do URL presignado
 * (servidor, src/services/server/r2.ts) e no PUT do browser
 * (src/services/api/photosApi.ts) — qualquer diferença faz o R2 rejeitar
 * o envio com erro de assinatura.
 */
export const CACHE_CONTROL_IMMUTABLE = "public, max-age=31536000, immutable";
