import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { differenceInDays, set } from "date-fns";

/*
interface Recibo {
  ARCHIVO: string;
  ESTADO_FIRMA: string;
  FECHA_ESTADO_FIRMA: string ;
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
}*/

interface NotificationCardProps {
  //recibo: Recibo;
  index: number;
  notificacion: any;
  /*set: React.Dispatch<React.SetStateAction<Recibo>>;
  set2: React.Dispatch<React.SetStateAction<boolean>>;
  habilitada: boolean;
  empresa: string;*/
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

  const cardClassName = `btn border-none text-white   w-28  "bg-slate-500"`;
  const cardClassSide = ` text-white font-semibold text-sm md:text-base h-full flex rounded-l-xl w-36 md:w-36 p-2 text-center justify-center items-center bg-grisclaro `;
  return (
    <div
      key={index}
      className={`flex  items-center bg-gray-200 md:h-24 h-40 rounded-xl mb-2 pr-4`}
    >
      <div className={cardClassSide}>
        {notificacion.OPERACION === 'A' 
          ? "DOC" 
          : `${differenceInDays(new Date(notificacion.FEC_HAS), new Date(notificacion.FEC_DES)) + 1} ${
              differenceInDays(new Date(notificacion.FEC_HAS), new Date(notificacion.FEC_DES)) + 1 === 1 ? "día" : "días"
            }`}
      </div>
      <div className=" md:flex md:justify-between md:w-full pl-4 md:pl-6 md:items-center ">
        <div className="text-black font-bold mb-5 md:mb-0 text-left">
            {(() => {
            if (notificacion.OPERACION === 'A') {
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
            
            <p className="text-gray-400">{new Date(notificacion.FEC_DES).toLocaleDateString() === new Date(notificacion.FEC_HAS).toLocaleDateString()
          ? new Date(notificacion.FEC_DES).toLocaleDateString()
          : `${new Date(notificacion.FEC_DES).toLocaleDateString()} - ${new Date(notificacion.FEC_HAS).toLocaleDateString()}`}</p>
        </div>{" "}
        <div className="flex space-x-2 ">
          <button
            className={`btn border-none btn-primary text-white w-36  bg-grisclaro2 hover:bg-grisclaro `}
            onClick={handleClick}
            disabled={false}
          >
            Leer detalle
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenciaCard;
