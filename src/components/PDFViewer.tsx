
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"


export default function PDFViewer() {
    return (
      <div className="h-full w-full">
      <iframe
        src="pdf.pdf"
        className="w-full h-full" 
        title="PDF Viewer"
      />
    </div>
    )
}