import React from "react";
import { useAppContext } from "@/contexts/AppContext";

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
  /*set: React.Dispatch<React.SetStateAction<Recibo>>;
  set2: React.Dispatch<React.SetStateAction<boolean>>;
  habilitada: boolean;
  empresa: string;*/
}

const NotificationCard: React.FC<NotificationCardProps> = ({ index }) => {
  const { postLogRecibo, getCookie } = useAppContext();
  const handleClick = async () => {};

  const cardClassName = `btn border-none text-white   w-28  "bg-slate-500"`;
  const cardClassSide = ` text-white font-semibold text-sm md:text-base h-full rounded-l-xl flex w-36 md:w-36 p-2 text-center justify-center items-center bg-slate-500 `;
  return (
    <div
      key={index}
      className={`flex  items-center bg-gray-200 md:h-24 h-32 rounded-xl mb-2 pr-4`}
    >
      <div className={cardClassSide}>
      12/12/24
      
      </div>
      <div className=" md:flex md:justify-between md:w-full pl-4 md:pl-6 md:items-center ">
        <div className="text-black font-bold mb-5 md:mb-0">El Viernes 21/12 vengan todos con corbata</div>
        <div className="flex space-x-2 ">
          <button
            className={`btn border-none btn-primary text-white w-36  bg-slate-500 hover:bg-slate-600 `}
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
