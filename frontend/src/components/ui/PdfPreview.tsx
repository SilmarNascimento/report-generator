import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfPreviewProps = {
  url: string | File;
  handleDelete?: () => void;
  width?: number;
};

export function PdfPreview({ url, handleDelete, width }: PdfPreviewProps) {
  return (
    <div className="w-full relative mb-2 h-auto">
      {handleDelete && (
        <span
          className="absolute -top-1 right-2 text-xl cursor-pointer text-destructive z-10"
          onClick={handleDelete}
        >
          &times;
        </span>
      )}
      <div className="w-full h-full overflow-hidden flex items-start justify-center">
        <Document file={url} className="w-full h-full">
          <Page pageNumber={1} width={width} />
        </Document>
      </div>
    </div>
  );
}
