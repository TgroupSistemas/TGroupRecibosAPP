import React from "react";
import { differenceInDays } from "date-fns";

interface PopUpLicProps {
  notificacionArray: any;
  notiAbierta: number;
  setNotiEstado: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopUpLicencia: React.FC<PopUpLicProps> = ({
  notificacionArray,
  notiAbierta,
  setNotiEstado,
}) => {
  const noti = notificacionArray[notiAbierta];

  // Normalize estado
  type EstadoNorm = "pendiente" | "autorizado" | "rechazado";

  const normalizeEstado = (raw: any): EstadoNorm => {
    if (raw === null || raw === undefined) return "pendiente";
    const s = String(raw).trim().toLowerCase();
    if (s === "p" || s.startsWith("pend")) return "pendiente";
    if (s === "a" || s.startsWith("autor")) return "autorizado";
    if (s === "x" || s.startsWith("recha")) return "rechazado";
    return "pendiente";
  };

  const estado = normalizeEstado(noti.ESTADO_ERP);

  const estadoMeta: Record<
    EstadoNorm,
    { label: string; color: string; bg: string; border: string; text: string }
  > = {
    pendiente: {
      label: "Pendiente",
      color: "text-gray-600",
      bg: "bg-gray-100",
      border: "border-gray-400",
      text: "text-gray-600",
    },
    autorizado: {
      label: "Autorizado",
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-700",
    },
    rechazado: {
      label: "Rechazado",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
    },
  };

  const tipoLicencia = (() => {
    switch (noti.TIPO_LIC) {
  case "V":
    return "Vacaciones";
  case "E":
    return "Enfermedad";
  case "A":
    return "Accidente";
  case "M":
    return "Matrimonio";
  case "N":
    return "Nacimiento de hijo/adopción";
  case "F":
    return "Fallecimiento de familiar";
  case "Z":
    return "Mudanza";
  case "D":
    return "Donación de sangre";
  case "X":
    return "Estudio/examen";
  case "T":
    return "Tareas gremiales";
  case "K":
    return "Día trabajado no fichado";
  case "B":
    return "Trámites Personales";
  case "G":
    return "Excedencia Maternidad";
  case "H":
    return "Examen Nivel Medio";
  case "I":
    return "Examen Nivel Universitario";
  case "J":
    return "Citación Judicial";
  case "C":
    return "Llegada demorada/salida anticipada justificada";
  default:
    return "Desconocido";
}
  })();
function formatDate(dateString : string): string {
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}
  const sameDay =
    new Date(noti.FEC_DES).toLocaleDateString() ===
    new Date(noti.FEC_HAS).toLocaleDateString();

  const rangoDias =
    differenceInDays(new Date(noti.FEC_HAS), new Date(noti.FEC_DES)) + 1;

  // --- Render --------------------------------------------------------------
  return (
    <div
      className={`fixed inset-0 flex items-center top-16 md:pt-0 pt-20 justify-center bg-black bg-opacity-50 transition-opacity duration-500`}
    >
      <div
        style={{ maxHeight: "80vh" }}
        className={`text-slate-700 pt-4 px-4 md:p-8 rounded-lg shadow w-full lg:w-4/6 md:w-4/5 overflow-y-auto mt-10 ${estadoMeta[estado].bg} border-t-8 ${estadoMeta[estado].border}`}
      >
        <h1 className={`text-lg font-bold mb-5 ${estadoMeta[estado].text}`}>
          {tipoLicencia}
          <br />
{
  sameDay
    ? formatDate(noti.FEC_DES)
    : `${formatDate(noti.FEC_DES)} - ${formatDate(noti.FEC_HAS)}`
}
          <div className="mt-1">
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${estadoMeta[estado].bg} ${estadoMeta[estado].text} border ${estadoMeta[estado].border}`}
            >
              {estadoMeta[estado].label}
            </span>
          </div>
        </h1>

        {noti.OPERACION !== "A" && (
          <>
            <span className="text-base">Días:</span>
            <p
              className={`text-lg font-semibold mb-3 border p-5 rounded-md ${estadoMeta[estado].border}`}
            >
              {rangoDias} {rangoDias === 1 ? "día" : "días"}
            </p>
          </>
        )}

        <span className="text-base">Notas:</span>
        {noti.NOTAS ? (
          <p
            className={`text-lg font-semibold mb-3 border p-5 rounded-md ${estadoMeta[estado].border}`}
          >
            {noti.NOTAS}
          </p>
        ) : (
          <p className="text-gray-500">No hay notas</p>
        )}

        {/* MOTIVO RECHAZO */}
        {estado === "rechazado" && noti.MOTIVO_RECHAZO && (
          <div className="mt-4">
            <span className="text-base text-red-700 font-semibold">
              Motivo del rechazo:
            </span>
            <p className="text-red-700 font-medium border border-red-400 bg-red-50 p-5 rounded-md mt-1">
              {noti.MOTIVO_RECHAZO}
            </p>
          </div>
        )}

        <div className="mt-3">
          <span className="text-base">Archivos:</span>
          <div className="flex flex-col space-y-2">
            {(!noti.ARCHIVOS ||
              noti.ARCHIVOS.trim() === "" ||
              noti.ARCHIVOS === "undefined") ? (
              <p className="text-gray-500">No hay archivos</p>
            ) : (
              (noti.ARCHIVOS ?? "")
                .split("|")
                .reduce((acc: any[], curr: string, index: number, array: string[]) => {
                  if (index % 2 === 0 && array[index + 1]) {
                    acc.push([curr, array[index + 1]]);
                  }
                  return acc;
                }, [])
                .map(([descripcion, ruta]: [string, string], index: number) => {
                  const isPDF = ruta.toLowerCase().endsWith(".pdf");
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 border p-2 rounded-md ${estadoMeta[estado].border}`}
                    >
                      <div className="w-20 h-20 flex items-center justify-center bg-gray-200 text-gray-700 font-bold">
                        {isPDF ? "PDF" : "IMG"}
                      </div>
                      <span className="text-base font-semibold">
                        <span className="font-bold">Descripción: </span>
                        <br /> {descripcion}
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setNotiEstado(false)}
            className={`text-white rounded-lg px-10 py-2 shadow-md transition duration-300 ease-in-out transform ${
              estado === "rechazado"
                ? "bg-red-600 hover:bg-red-500"
                : estado === "autorizado"
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpLicencia;
