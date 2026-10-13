import "server-only";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Readable } from "stream";
import { CACHE_CONTROL_IMMUTABLE } from "@/config/uploadLimits";
import type { HeadInfo } from "@/types";

const PRESIGN_EXPIRES_SECONDS = 600;

let cachedClient: S3Client | null = null;
let cachedBucket: string | null = null;

/**
 * Constrói (e valida) o cliente R2 só no primeiro uso real, e não na
 * importação do módulo — o `next build` importa as route handlers para as
 * inspecionar e rebentaria se as variáveis não existissem no build.
 */
function getR2(): { client: S3Client; bucket: string } {
  if (cachedClient && cachedBucket) {
    return { client: cachedClient, bucket: cachedBucket };
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;

  const missing = [
    ["R2_ACCOUNT_ID", accountId],
    ["R2_ACCESS_KEY_ID", accessKeyId],
    ["R2_SECRET_ACCESS_KEY", secretAccessKey],
    ["R2_BUCKET_NAME", bucket],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Configuração do Cloudflare R2 incompleta. Faltam as variáveis: ${missing.join(", ")}.`
    );
  }

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId as string,
      secretAccessKey: secretAccessKey as string,
    },
  });
  cachedBucket = bucket as string;

  return { client: cachedClient, bucket: cachedBucket };
}

function isNotFoundError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name?: string }).name === "NotFound"
  );
}

/** Apaga uma ou mais chaves num único pedido. Não faz nada com lista vazia. */
export async function deleteObjects(keys: string[]): Promise<void> {
  const cleanKeys = keys.filter(Boolean);
  if (cleanKeys.length === 0) return;

  const { client, bucket } = getR2();
  await client.send(
    new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: { Objects: cleanKeys.map((Key) => ({ Key })) },
    })
  );
}

export async function listObjects(prefix: string) {
  const { client, bucket } = getR2();
  const result = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix }));
  return result.Contents ?? [];
}

/** Stream do corpo de um objeto, ou null se não existir. */
export async function getObjectStream(key: string): Promise<Readable | null> {
  const { client, bucket } = getR2();
  try {
    const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return (result.Body as Readable) ?? null;
  } catch (err) {
    if (isNotFoundError(err)) return null;
    throw err;
  }
}

/** Metadados do objeto, ou null se não existir. Confirma que um upload presignado aconteceu mesmo. */
export async function headObject(key: string): Promise<HeadInfo | null> {
  const { client, bucket } = getR2();
  try {
    const result = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return { contentLength: result.ContentLength ?? 0, contentType: result.ContentType };
  } catch (err) {
    if (isNotFoundError(err)) return null;
    throw err;
  }
}

export async function getPresignedPutUrl(key: string, contentType: string): Promise<string> {
  const { client, bucket } = getR2();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    CacheControl: CACHE_CONTROL_IMMUTABLE,
  });
  return getSignedUrl(client, command, { expiresIn: PRESIGN_EXPIRES_SECONDS });
}
