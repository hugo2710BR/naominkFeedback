import { useEffect, useRef, useState } from "react";
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/config/uploadLimits";
import { formatCharCount } from "@/helpers/format";
import { prepareImageVariants } from "@/helpers/imageProcessing";
import { isImageFile } from "@/helpers/validation";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { abortUpload, confirmUpload, putToR2, requestPresign } from "@/services/api/photosApi";
import type { ImageVariants, Photo, PresignResponse } from "@/types";

const CLOSE_ANIMATION_MS = 300;
const DRAG_CLOSE_RATIO = 0.25;
const DRAG_CLOSE_MIN_PX = 90;
const NETWORK_ERROR =
  "Não foi possível publicar a fotografia. Verifica a tua ligação e tenta novamente.";

interface UseUploadSheetParams {
  onClose: () => void;
  onPublished: (photo: Photo) => void;
  onPendingApproval: () => void;
}

export function useUploadSheet({ onClose, onPublished, onPendingApproval }: UseUploadSheetParams) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [variants, setVariants] = useState<ImageVariants | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animação de entrada/saída + arrastar para fechar. O sheet mantém-se
  // montado durante a animação de fecho — o `onClose` (que o desmonta no
  // pai) só é chamado quando a animação termina.
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const dragStartYRef = useRef(0);
  const closeTimeoutRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  useBodyScrollLock(true, { pinBody: true });

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function closeAndThen(callback: () => void) {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsOpen(false);
    setDragY(0);
    closeTimeoutRef.current = window.setTimeout(callback, CLOSE_ANIMATION_MS);
  }

  function requestClose() {
    closeAndThen(onClose);
  }

  useEscapeKey(requestClose);

  function handleHandlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleHandlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setDragY(Math.max(0, e.clientY - dragStartYRef.current));
  }

  function handleHandlePointerEnd() {
    if (!isDragging) return;
    setIsDragging(false);
    const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
    const threshold = Math.max(DRAG_CLOSE_MIN_PX, sheetHeight * DRAG_CLOSE_RATIO);
    if (dragY > threshold) {
      requestClose();
    } else {
      setDragY(0);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!isImageFile(file)) {
      setError("Escolhe um ficheiro de imagem.");
      return;
    }

    setError(null);
    setIsPreparing(true);
    try {
      const ready = await prepareImageVariants(file);
      setVariants(ready);
      setPreviewUrl(URL.createObjectURL(ready.web));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível processar esta foto.");
    } finally {
      setIsPreparing(false);
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  function failPublish(errorMessage: string) {
    setError(errorMessage);
    setIsPublishing(false);
  }

  async function handlePublish() {
    if (!variants || name.trim().length === 0) return;
    setIsPublishing(true);
    setError(null);

    let presign: PresignResponse | null = null;

    try {
      const presignResult = await requestPresign({
        thumbContentType: variants.thumb.type,
        thumbSize: variants.thumb.size,
        webContentType: variants.web.type,
        webSize: variants.web.size,
        originalContentType: variants.original.type,
        originalSize: variants.original.size,
      });

      if (!presignResult.ok || !presignResult.data) {
        failPublish(presignResult.data?.error ?? NETWORK_ERROR);
        return;
      }

      const slots: PresignResponse = presignResult.data;
      presign = slots;

      await Promise.all([
        putToR2(slots.thumb, variants.thumb, "image/jpeg"),
        putToR2(slots.web, variants.web, "image/jpeg"),
        slots.original
          ? putToR2(slots.original, variants.original, variants.original.type)
          : Promise.resolve(),
      ]);

      const confirmResult = await confirmUpload({
        uuid: slots.uuid,
        thumbKey: slots.thumb.key,
        webKey: slots.web.key,
        originalKey: slots.original?.key ?? null,
        name: name.trim(),
        message: message.trim(),
      });

      if (!confirmResult.ok) {
        // O confirm já limpa o R2 nos seus próprios caminhos de erro.
        failPublish(confirmResult.data?.error ?? NETWORK_ERROR);
        return;
      }

      const published = confirmResult.data;
      if (published?.pending) {
        closeAndThen(onPendingApproval);
      } else if (published?.photo) {
        const photo = published.photo;
        closeAndThen(() => onPublished(photo));
      }
    } catch {
      if (presign) await abortUpload(presign);
      failPublish(NETWORK_ERROR);
    }
  }

  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation();
  }

  const hasPhoto = !!variants;
  const hasName = name.trim().length > 0;
  const publishDisabled = !hasPhoto || !hasName || isPublishing || isPreparing;

  // Ajuda abaixo dos botões enquanto falta algo obrigatório.
  let helperText: string | null = null;
  if (!hasPhoto && !hasName) helperText = "Falta uma foto e o teu nome.";
  else if (!hasPhoto) helperText = "Falta uma foto.";
  else if (!hasName) helperText = "Falta o teu nome.";

  const sheetStyle: React.CSSProperties = {
    transform: isDragging ? `translateY(${dragY}px)` : isOpen ? "translateY(0)" : "translateY(100%)",
    transition: isDragging ? "none" : "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
  };

  return {
    sheetRef,
    fileInputRef,
    sheetStyle,
    isOpen,
    previewUrl,
    name,
    message,
    error,
    isPreparing,
    isPublishing,
    publishDisabled,
    helperText,
    nameCount: formatCharCount(name, MAX_NAME_LENGTH),
    messageCount: formatCharCount(message, MAX_MESSAGE_LENGTH),
    requestClose,
    openFilePicker,
    stopPropagation,
    handleHandlePointerDown,
    handleHandlePointerMove,
    handleHandlePointerEnd,
    handleFileChange,
    handleNameChange,
    handleMessageChange,
    handlePublish,
  };
}
