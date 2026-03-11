import { useCallback, useState } from "react";
import html2pdf from "html2pdf.js";

export interface PdfExportOptions {
  filename: string;
  orientation?: "portrait" | "landscape";
  /** CSS selectors for elements to remove from the PDF */
  selectorsToHide?: string[];
}

export const useExportToPdf = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = useCallback(
    async (element: HTMLElement, options: PdfExportOptions) => {
      setIsExporting(true);

      // Find the widest scrollable child to know the real content width
      let maxScrollWidth = element.scrollWidth;
      element.querySelectorAll<HTMLElement>("*").forEach((child) => {
        if (child.scrollWidth > maxScrollWidth) {
          maxScrollWidth = child.scrollWidth;
        }
      });
      const captureWidth = maxScrollWidth + 40;

      try {
        await html2pdf()
          .set({
            margin: [8, 8, 8, 8],
            filename: options.filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              logging: false,
              scrollX: 0,
              scrollY: 0,
              windowWidth: captureWidth,
              onclone: (_doc: Document, clonedEl: HTMLElement) => {
                // Remove action buttons from clone
                (options.selectorsToHide ?? []).forEach((selector) => {
                  clonedEl.querySelectorAll(selector).forEach((el) => el.remove());
                });

                // Expand the cloned element so all columns fit
                clonedEl.style.width = `${captureWidth}px`;
                clonedEl.style.maxWidth = "none";

                // Fix overflow, max-width constraints, and sticky in all children
                clonedEl.querySelectorAll<HTMLElement>("*").forEach((el) => {
                  el.style.overflow = "visible";
                  el.style.maxWidth = "none";
                  if (_doc.defaultView?.getComputedStyle(el).position === "sticky") {
                    el.style.position = "relative";
                  }
                });
              },
            },
            jsPDF: {
              unit: "mm",
              format: "a4",
              orientation: options.orientation ?? "landscape",
            },
            pagebreak: { mode: ["css", "legacy"] },
          })
          .from(element)
          .save();
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { isExporting, exportToPdf };
};
