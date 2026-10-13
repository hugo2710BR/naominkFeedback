export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9.\-_ ]/gi, "").trim() || "foto";
}

/**
 * Transfere via blob + URL blob: da mesma origem em vez de ligar
 * diretamente ao URL do R2. Um <a download> simples é ignorado pelos
 * browsers para URLs de outra origem (o R2 é outra origem), e abriria a
 * imagem num separador novo em vez de a transferir.
 */
export async function downloadImage(url: string, filename: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("download failed");
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}
