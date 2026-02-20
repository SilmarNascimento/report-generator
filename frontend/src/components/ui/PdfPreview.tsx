import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type PdfPreviewProps = {
  url: string | File
  handleDelete: () => void
}

export function PdfPreview({url, handleDelete}: PdfPreviewProps) {
  return (
    <div className="w-auto mr-1 relative mb-2 h-auto">
      <span
        className="absolute -top-1 right-2 text-xl cursor-pointer text-red-400 z-10"
        onClick={handleDelete}
        >
        &times;
      </span>
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        <Document file={url} className="w-full h-full">
          <Page pageNumber={1} width={200}/>
        </Document>
      </div>
    </div>
  );
}