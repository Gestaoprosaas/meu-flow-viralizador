import { useState } from 'react';

export function useCopyPrompt() {
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  const copyPrompt = async (id: number | string, text: string, onCopySuccess?: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      if (onCopySuccess) {
        onCopySuccess();
      }
      setTimeout(() => {
        setCopiedId(null);
      }, 3000);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          setCopiedId(id);
          if (onCopySuccess) {
            onCopySuccess();
          }
          setTimeout(() => {
            setCopiedId(null);
          }, 3000);
          return true;
        }
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      return false;
    }
  };

  return { copiedId, copyPrompt };
}
