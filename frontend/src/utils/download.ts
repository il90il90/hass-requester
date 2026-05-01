/**
 * Detect iOS (iPhone/iPad) including iPadOS 13+ which masquerades as macOS.
 */
function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/**
 * Save JSON data as a file. Tries multiple strategies for maximum compatibility
 * across desktop, mobile Safari, Android, and Home Assistant Companion (WKWebView).
 *
 * Strategy order:
 *  1. Web Share API with File object  (iOS 15+ Safari, Android Chrome 86+)
 *  2. <a href="data:..."> download    (iOS 13+ Safari — data URLs work, blob URLs don't)
 *  3. <a href="blob:..."> download    (desktop Chrome/Firefox, Android)
 *  4. Open blob in new tab            (last-resort for restricted WebViews)
 *  5. Show copy-dialog                (absolute fallback — always works)
 */
export async function saveJsonFile(
  filename: string,
  data: string,
  showFallbackDialog: (data: string, filename: string) => void
): Promise<void> {
  // ── Strategy 1: Web Share API (best on mobile) ──────────────────────────
  if (typeof navigator.share === "function") {
    try {
      const blob = new Blob([data], { type: "application/json" });
      const file = new File([blob], filename, { type: "application/json" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      // Share failed — continue to next strategy
    }
  }

  // ── Strategy 2: data: URI download (iOS Safari 13+) ─────────────────────
  // iOS Safari supports <a download> for data: URLs but NOT for blob: URLs.
  if (isIOS()) {
    try {
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(data)}`;
      const a = document.createElement("a");
      a.href = dataUri;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 300);
      return;
    } catch {
      // Fall through
    }
  }

  // ── Strategy 3: blob: URL download (desktop / Android) ──────────────────
  try {
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 300);
    return;
  } catch {
    // Fall through
  }

  // ── Strategy 4: open blob in new tab (restricted WebViews) ──────────────
  try {
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const newWin = window.open(url, "_blank");
    if (newWin) {
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      return;
    }
    URL.revokeObjectURL(url);
  } catch {
    // Fall through
  }

  // ── Strategy 5: copy-dialog fallback ────────────────────────────────────
  showFallbackDialog(data, filename);
}

/**
 * Open a native file-picker and return the selected File.
 * Appended to document.body to work correctly inside Shadow DOM.
 */
export function pickJsonFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener(
      "change",
      () => {
        const file = input.files?.[0] ?? null;
        if (document.body.contains(input)) document.body.removeChild(input);
        resolve(file);
      },
      { once: true }
    );

    // Resolve null if the user dismisses without picking
    const onFocus = () => {
      setTimeout(() => {
        if (document.body.contains(input)) {
          document.body.removeChild(input);
          resolve(null);
        }
      }, 600);
    };
    window.addEventListener("focus", onFocus, { once: true });

    input.click();
  });
}
