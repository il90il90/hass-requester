/**
 * Save JSON data as a file. On mobile browsers (iOS Safari, etc.) that don't
 * support the `download` attribute, falls back to the Web Share API so the
 * user can save/share the file via the native sheet.
 */
export async function saveJsonFile(filename: string, data: string): Promise<void> {
  const blob = new Blob([data], { type: "application/json" });

  // Try Web Share API first (works reliably on mobile — iOS 15+, Android)
  if (typeof navigator.share === "function") {
    try {
      const file = new File([blob], filename, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return;
      }
    } catch (err) {
      // User cancelled share or share failed — fall through to blob download
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }

  // Desktop fallback: append link to body so iOS WKWebView / old browsers work
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  // Small delay before cleanup so the browser has time to start the download
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Open a native file-picker and return the selected File.
 * Works inside Shadow DOM by appending the input to document.body.
 */
export function pickJsonFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", () => {
      const file = input.files?.[0] ?? null;
      document.body.removeChild(input);
      resolve(file);
    }, { once: true });

    // If user cancels without picking (focus returns to window)
    window.addEventListener("focus", () => {
      setTimeout(() => {
        if (document.body.contains(input)) {
          document.body.removeChild(input);
          resolve(null);
        }
      }, 500);
    }, { once: true });

    input.click();
  });
}
