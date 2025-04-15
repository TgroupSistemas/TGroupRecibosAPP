import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { set } from "date-fns";

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

const NotificationCard: React.FC<NotificationCardProps> = ({
  index,
  notificacion,
  setNotiAbierta,
  setNotiEstado,
}) => {
  const { postLogRecibo, getCookie, updateNotificacion } = useAppContext();
  const handleClick = async () => {
    setNotiAbierta(index);
    setNotiEstado(true);
    if(notificacion.ESTADO === "L") return;
    notificacion.ESTADO = "L";
    await updateNotificacion(notificacion
    );
  };

  const cardClassName = `btn border-none text-white   w-28  "bg-slate-500"`;
  const cardClassSide = `text-white font-semibold text-sm md:text-base h-full rounded-l-xl flex w-20 md:w-36 p-2 text-center justify-center items-center ${
    notificacion.ESTADO === "L" ? "bg-slate-500" : "bg-grisclaro2"
  }`;
  return (
    <div
      key={index}
      className={`flex  items-center bg-gray-200 md:h-24 h-40 rounded-xl mb-2 pr-4`}
    >
      <div className={cardClassSide}>
        {new Date(notificacion.FECHA_HORA).toLocaleDateString()}
      </div>
      <div className=" md:flex md:justify-between md:w-full pl-4 md:pl-6 md:items-center ">
        <div className="text-black font-bold mb-5 md:mb-0">
          {notificacion.NOTAS.trim().substring(
            notificacion.NOTAS.trim().indexOf("<p>") + 3,
            notificacion.NOTAS.trim().indexOf("</p>")
          )}
        </div>{" "}
        <div className="flex space-x-2 ">
              <button
              className={`btn border-none text-white w-36 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                notificacion.ESTADO === "L" ? "bg-slate-500 hover:bg-slate-600" : "bg-grisclaro2 hover:bg-grisclaro"
              }`}
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

export default NotificationCard;
