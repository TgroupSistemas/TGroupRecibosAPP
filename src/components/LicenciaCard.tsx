import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { differenceInDays } from "date-fns";

interface NotificationCardProps {
  index: number;
  notificacion: any;
  setNotiAbierta: React.Dispatch<React.SetStateAction<number>>;
  setNotiEstado: React.Dispatch<React.SetStateAction<boolean>>;
}

const LicenciaCard: React.FC<NotificationCardProps> = ({
  index,
  notificacion,
  setNotiAbierta,
  setNotiEstado,
}) => {
  const { postLogRecibo, getCookie } = useAppContext();

  const handleClick = async () => {
    setNotiAbierta(index);
    setNotiEstado(true);
  };

  // --- Estado & Colores ------------------------------------------------------
  type EstadoNorm = "pendiente" | "autorizado" | "rechazado";

  const normalizeEstado = (raw: any): EstadoNorm => {
    if (raw === null || raw === undefined) return "pendiente";
    const s = String(raw).trim().toLowerCase();
    if (s === "p" || s.startsWith("pend")) return "pendiente";
    if (s === "a" || s.startsWith("autor")) return "autorizado";
    if (s === "x" || s.startsWith("recha")) return "rechazado";
    return "pendiente";
  };

  const estado = normalizeEstado(notificacion?.ESTADO_ERP);

  const estadoMeta: Record<
    EstadoNorm,
    {
      label: string;
      badge: string;
      badgeText: string;
      sideBg: string;
    }
  > = {
    pendiente: {
      label: "Pendiente",
      badge: "bg-gray-500",
      badgeText: "text-white",
      sideBg: "bg-gray-400",
    },
    autorizado: {
      label: "Autorizado",
      badge: "bg-green-600",
      badgeText: "text-white",
      sideBg: "bg-green-600",
    },
    rechazado: {
      label: "Rechazado",
      badge: "bg-red-600",
      badgeText: "text-white",
      sideBg: "bg-red-600",
    },
  };

  const sameDay =
    new Date(notificacion.FEC_DES).toLocaleDateString() ===
    new Date(notificacion.FEC_HAS).toLocaleDateString();

  const rangoDias =
    differenceInDays(
      new Date(notificacion.FEC_HAS),
      new Date(notificacion.FEC_DES)
    ) + 1;

  return (
    <div
      key={index}
      className={`flex items-center bg-gray-200 md:h-24 h-48 rounded-xl mb-2 pr-4 border-l-4 }`}
    >
      <div
        className={`text-white font-semibold text-sm md:text-base h-full flex rounded-l-xl w-36 md:w-36 p-2 text-center justify-center items-center ${estadoMeta[estado].sideBg}`}
      >
        {notificacion.OPERACION === "A"
          ? "DOC"
          : `${rangoDias} ${rangoDias === 1 ? "día" : "días"}`}
      </div>

      <div className="md:flex md:justify-between md:w-full pl-4 md:pl-6 md:items-center w-full">
        <div className="text-black font-bold mb-3 md:mb-0 text-left">
          {(() => {
            if (notificacion.OPERACION === "A") {
              return "Documentación";
            }
            switch (notificacion.TIPO_LIC) {
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
              case "C":
                return "Enfermedad/accidente";
              case "P":
                return "Maternidad/paternidad";
              case "T":
                return "Tareas gremiales";
              case "O":
                return "Otras";
              default:
                return "Desconocido";
            }
          })()}

          <div className="mt-1 flex md:items-center gap-2 flex-col md:flex-row">
            <p className="text-gray-400">
              {sameDay
                ? new Date(notificacion.FEC_DES).toLocaleDateString()
                : `${new Date(
                    notificacion.FEC_DES
                  ).toLocaleDateString()} - ${new Date(
                    notificacion.FEC_HAS
                  ).toLocaleDateString()}`}
            </p>

            {/* Estado badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-min ${estadoMeta[estado].badge} ${estadoMeta[estado].badgeText}`}
              title={`Estado: ${estadoMeta[estado].label}`}
            >
              {estadoMeta[estado].label}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            className="btn border-none btn-primary text-white w-28 bg-gray-500 hover:bg-gray-400"
            onClick={handleClick}
            disabled={false}
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenciaCard;
