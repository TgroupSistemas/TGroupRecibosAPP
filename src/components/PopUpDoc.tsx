import React, { useState, useEffect } from "react";

import PDFViewer from "@/components/PDFViewer";
import Firma from "./Firma";
import { useAppContext } from "@/contexts/AppContext";

interface Recibo {
  ARCHIVO: string;
  ESTADO_FIRMA: string;
  FECHA_ESTADO_FIRMA: string;
  FEC_ULT_ACT: string;
  FK_SUE_LIQUIDACIONES: number;
  FK_WS_CLIENTES: string;
  FK_WS_USUARIOS: string;
  ID: string;
  MOTIVO_DISCONFORMIDAD: string;
  NUM_RECIBO: number;
  PERIODO: string;
  STATUS_API: string;
  TIP_LIQ: string;
}
interface PopUpDocProps {
  reciboRecibido: Recibo;
  cerrar: React.Dispatch<React.SetStateAction<boolean>>;
  empresa: string;
}
const getTipoLiquidacion = (tipo: string): string => {
  switch (tipo) {
    case "V":
      return "Vacaciones";
    case "M":
      return "Mensual";
    case "J":
      return "Jornal";
    case "F":
      return "Liquidación Final";
    default:
      return tipo;
  }
};

const PopUpDoc: React.FC<PopUpDocProps> = ({
  reciboRecibido,
  cerrar,
  empresa,
}) => {
  const { PDF, PDFLoading } = useAppContext();
  const tipoLiquidacion = getTipoLiquidacion(reciboRecibido.TIP_LIQ);
  const [popUpFirmaOpen, setPopUpFirmaOpen] = useState(false);
  const [estadoFirma, setEstadoFirma] = useState(1);
  const periodoDate = new Date(`${reciboRecibido.PERIODO}/01`);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - periodoDate.getTime();
  const dayDifference = timeDifference / (1000 * 3600 * 24);

  return (
    <div
      className={`fixed inset-0 flex items-center top-16 md:pt-0 pt-20 overflow-y justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
    >
      {" "}
      <div
        style={{ maxHeight: "80vh" }}
        className="bg-white text-slate-600 pt-4 px-4 lg:h-min md:h-5/6 h-full md:p-8 rounded-lg shadow w-full lg:w-4/6 md:w-4/5  min-h-5/6 overflow-y-auto mt-10"
      >
                    <h2 className="text-xl text-black font-bold mb-3">
              {tipoLiquidacion} - {reciboRecibido.PERIODO}
            </h2>
        <div className="flex justify-between md:flex-row flex-col ">
          <div>

            <p>
              <span className="font-bold ">Estado: </span>{" "}
              {reciboRecibido.ESTADO_FIRMA === "F"
                ? "Firmado"
                : reciboRecibido.ESTADO_FIRMA === "X"
                ? "Firmado en disconformidad"
                : "Sin firma"}
            </p>
            {reciboRecibido.ESTADO_FIRMA === "X" ||
            reciboRecibido.ESTADO_FIRMA === "F" ? (
              <p>
                <span className="font-bold ">Fecha de firma: </span>
                {(() => {
                  const date = new Date(reciboRecibido.FECHA_ESTADO_FIRMA);
                  const months = [
                    "enero",
                    "febrero",
                    "marzo",
                    "abril",
                    "mayo",
                    "junio",
                    "julio",
                    "agosto",
                    "septiembre",
                    "octubre",
                    "noviembre",
                    "diciembre",
                  ];
                  return `${date.getUTCDate()} de ${
                    months[date.getUTCMonth()]
                  } de ${date.getUTCFullYear()}, ${date.getUTCHours()}:${date
                    .getUTCMinutes()
                    .toString()
                    .padStart(2, "0")}`;
                })()}
              </p>
            ) : null}
            {reciboRecibido.MOTIVO_DISCONFORMIDAD !== "" && (
              <p className="text-indigo-800">
                <span className="font-bold text-indigo-800">
                  Tu comentario:{" "}
                </span>
                {reciboRecibido.MOTIVO_DISCONFORMIDAD}
              </p>
            )}
          </div>
          <button
            className={`px-4 py-2 h-12 text-sm mt-3 md:mt-0  text-white rounded-lg transition-all ${
              reciboRecibido.ESTADO_FIRMA === "X" || (!PDFLoading && !PDF)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
            onClick={() => {
              setPopUpFirmaOpen(true);
              setEstadoFirma(2);
            }}
            disabled={
              reciboRecibido.ESTADO_FIRMA === "X" || (!PDFLoading && !PDF)
            }
          >
            {!PDFLoading && !PDF
              ? "Agregar comentario"
              : reciboRecibido.MOTIVO_DISCONFORMIDAD !== ""
              ? "Cambiar comentario"
              : "Agregar comentario"}
          </button>
        </div>

        <div className=" justify-betwee w-full  mt-3">
          {dayDifference <= 40 ||
          (reciboRecibido.ESTADO_FIRMA != "X" &&
            reciboRecibido.ESTADO_FIRMA != "F") ? (
            <>
              <button
                className={`px-4 py-2 mr-2 w-full h-12 text-white rounded-lg transition-all ${
                  reciboRecibido.ESTADO_FIRMA === "F" || (!PDFLoading && !PDF)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-verde hover:bg-green-700"
                }`}
                onClick={() => {
                  setPopUpFirmaOpen(true);
                  setEstadoFirma(1);
                }}
                disabled={
                  reciboRecibido.ESTADO_FIRMA === "F" || (!PDFLoading && !PDF)
                }
              >
                {!PDFLoading && !PDF
                  ? "Firmar"
                  : reciboRecibido.ESTADO_FIRMA === "X"
                  ? "Cambiar a firma en conformidad"
                  : "Firmar"}
              </button>
            </>
          ) : (
            <p className="text-red-500">
              Ha pasado el límite de 40 días para cambiar el estado de la firma.
            </p>
          )}
        </div>

        <p className="mb-4"></p>
        <div style={{ height: "30em" }} className="">
          {" "}
          <PDFViewer id={reciboRecibido.ARCHIVO}></PDFViewer>
        </div>
        <button
          className="px-4 py-2 mb-3 w-full mt-15 bg-gray-300 text-gray-700 rounded hover:bg-gray-200 transition-all"
          onClick={() => cerrar(false)}
        >
          Cerrar
        </button>
      </div>
      {popUpFirmaOpen == true && (
        <Firma
          setPopUpFirmaOpen={setPopUpFirmaOpen}
          estado={estadoFirma}
          id={reciboRecibido.ID}
          empresa={empresa}
        ></Firma>
      )}
    </div>
  );
};

export default PopUpDoc;
