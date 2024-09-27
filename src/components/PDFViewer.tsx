import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  toolbarPlugin,
  type ToolbarSlot,
  type TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import { LocalizationMap, LocalizationContext } from "@react-pdf-viewer/core";
import es_ES from "@react-pdf-viewer/locales/lib/es_ES.json";
import { useAppContext } from "@/contexts/AppContext";

interface PDFProps {
  id: string;
}
const PDFViewer: React.FC<PDFProps> = ({ id }) => {
  const { fetchPDF, PDF, PDFLoading } = useAppContext();
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    RotateBackwardMenuItem: () => <></>,
    RotateForwardMenuItem: () => <></>,
    GoToPreviousPage: () => <></>,
    OpenMenuItem: () => <></>,
    Open: () => <></>,
    EnterFullScreen: () => <></>,
    EnterFullScreenMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
    SwitchScrollModeMenuItem: () => <></>,
  });
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    fetchPDF(id);

    // Cleanup the object URL when the component unmounts
    return () => {
      if (PDF) {
        URL.revokeObjectURL(PDF);
      }
    };
  }, []);

  return (
    <div className="h-full pb-12 w-full">
      {PDF && !PDFLoading ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
          <LocalizationContext.Provider
            value={{ l10n: es_ES, setL10n: () => {} }}
          >
            <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>

            <Viewer
              fileUrl={URL.createObjectURL(PDF)}
              plugins={[toolbarPluginInstance]}
              localization={es_ES as unknown as LocalizationMap}
              defaultScale={1}
            />
          </LocalizationContext.Provider>
        </Worker>
      ) : PDFLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        !PDFLoading && (
          <div className="flex justify-center items-center h-full">
            <span className="text-red-400">
              Ha ocurrido un error al cargar el recibo. Por favor, intente
              nuevamente más tarde.
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default PDFViewer;
