declare module 'html2pdf.js' {
  interface HTML2PDFOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: {
      type: 'jpeg' | 'png';
      quality: number;
    };
    html2canvas?: {
      scale: number;
      letterRendering: boolean;
    };
    jsPDF?: {
      unit: 'mm' | 'cm' | 'in' | 'px';
      format: 'a4' | 'letter' | [number, number];
      orientation: 'portrait' | 'landscape';
    };
  }

  interface HTML2PDF {
    set(options: HTML2PDFOptions): HTML2PDF;
    from(element: HTMLElement): HTML2PDF;
    output(type: 'blob' | 'arraybuffer' | 'bloburi' | 'datauri' | 'datauristring'): Promise<Blob>;
  }

  function html2pdf(): HTML2PDF;
  export = html2pdf;
}
