import React from "react";
import { useAppContext } from '@/contexts/AppContext';


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
}

interface ReciboCardProps {
  recibo: Recibo;
  index: number;
  set: React.Dispatch<React.SetStateAction<Recibo>>;
  set2: React.Dispatch<React.SetStateAction<boolean>>;
  habilitada: boolean;
  empresa: string;
}
const getTipoLiquidacion = (tipo: string): string => {
  switch (tipo) {
    case "M":
      return "Mensual";
    case "1":
      return "Jornal (1° Quincena)";
    case "2":
      return "Jornal (2° Quincena)";
    case "A":
      return "Aguinaldo";
    case "V":
      return "Vacaciones";
    case "L":
      return "Lic. matrimonio";
    case "D":
      return "Anticipo";
    case "F":
      return "Liquidación final";
    case "C":
      return "Comisiones";
    case "E":
      return "Especial";
    case "J":
      return "Ajuste";
    default:
      return tipo;
}
};

const ReciboCard: React.FC<ReciboCardProps> = ({
  recibo,
  index,
  set,
  set2,
  habilitada,
  empresa
}) => {
  const { postLogRecibo, getCookie } = useAppContext();
  const idRec = recibo;
  const handleClick = async () => {
    set(recibo);

    set2(true);
    await postLogRecibo(empresa, "D", recibo.ID, await getCookie("id"));

  };

  const tipoLiquidacion = getTipoLiquidacion(recibo.TIP_LIQ);
  const cardClassName = `btn border-none text-white   w-28  ${
    recibo.ESTADO_FIRMA !== "F" ? "bg-red-500" : "bg-slate-500"
  } `;
  const cardClassSide = ` text-white font-semibold text-sm md:text-base h-full rounded-l-xl flex w-36 md:w-48 p-2 text-center justify-center items-center  ${
    recibo.ESTADO_FIRMA === "F" ? "bg-green-600" : recibo.ESTADO_FIRMA === "X" ? "bg-red-500" : "bg-slate-500"  }   ${
  habilitada == true && recibo.ESTADO_FIRMA!="X" && recibo.ESTADO_FIRMA!="F" ? "bg-blue-500" : ""}
  }`;
  return (
    <div
      key={index}
      className={ `flex  items-center bg-gray-200 md:h-24 h-32 rounded-xl mb-2 pr-4 ${ habilitada == false ? "cursor-not-allowed bg-gray-300" : "" }`}
    >
      <div className={cardClassSide}>
        {recibo.ESTADO_FIRMA === "F" ? ( <div>Firmado</div>):recibo.ESTADO_FIRMA === "X" ?( <div>Firmado en disconformidad</div>):(
        <div>Pendiente de firma</div>)}
      </div>
      <div className=" md:flex md:justify-between md:w-full pl-4 md:pl-6 md:items-center ">
        <div className="text-black font-bold mb-5 md:mb-0">
          {tipoLiquidacion} - {recibo.PERIODO} 
        </div>
        <div className="flex space-x-2 ">
          <button
            className={`btn border-none btn-primary text-white w-36  ${
              recibo.ESTADO_FIRMA === "F" ? "bg-green-600 hover:bg-green-700" : recibo.ESTADO_FIRMA === "X" ? "bg-red-500  hover:bg-red-600" : "bg-slate-500"  }   ${
            habilitada == true && recibo.ESTADO_FIRMA!="X" && recibo.ESTADO_FIRMA!="F" ? "bg-blue-500" : ""}`}
            onClick={handleClick}
            disabled={!habilitada}
          >
            Ver en detalle
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default ReciboCard;
