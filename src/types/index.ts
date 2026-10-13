/**
 * Types partilhados transversalmente (screens, hooks, helpers, services e
 * API routes). Types usados só dentro de um único ficheiro ficam nesse ficheiro.
 */

/** Linha da tabela `photos` no Supabase. */
export interface Photo {
  id: string;
  name: string;
  message: string | null;
  thumb_key: string;
  web_key: string;
  original_key: string | null;
  approved: boolean;
  created_at: string;
}

/** Item mostrado na grelha do mural e no modal de foto. */
export interface GalleryItem {
  id: string;
  url: string;
  thumbUrl: string;
  name: string;
  message: string | null;
}

export type CelebrationVariant = "published" | "pending";

export type ModerationAction = "approve" | "reject";

export type ModerationMode = "auto" | "manual";

/** Variantes de uma foto preparadas no browser antes do envio para o R2. */
export interface ImageVariants {
  thumb: File;
  web: File;
  original: File;
}

export interface PhotoKeys {
  thumbKey: string;
  webKey: string;
  originalKey: string | null;
}

export interface PresignedSlot {
  url: string;
  key: string;
}

export interface PresignRequest {
  thumbContentType: string;
  thumbSize: number;
  webContentType: string;
  webSize: number;
  originalContentType: string;
  originalSize: number;
}

export interface PresignResponse {
  uuid: string;
  thumb: PresignedSlot;
  web: PresignedSlot;
  original: PresignedSlot | null;
}

export interface ConfirmRequest {
  uuid: string;
  thumbKey: string;
  webKey: string;
  originalKey: string | null;
  name: string;
  message: string;
}

export interface PublishResponse {
  photo: Photo | null;
  pending: boolean;
}

/** Ficheiros no bucket R2 que nenhuma linha de `photos` referencia. */
export interface OrphanGroup {
  uuid: string;
  keys: string[];
  totalSize: number;
  lastModified: string;
}

export interface AdminData {
  pendingPhotos: Photo[];
  approvedPhotos: Photo[];
  orphanGroups: OrphanGroup[];
}

export interface ValidatedFields {
  name: string;
  message: string | null;
}

export type ValidationResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export type RateLimitScope = "upload" | "upload-abort" | "admin-login";

export interface RateLimitRule {
  /** Máximo de pedidos permitidos por janela. */
  limit: number;
  windowSeconds: number;
}

export interface HeadInfo {
  contentLength: number;
  contentType: string | undefined;
}
