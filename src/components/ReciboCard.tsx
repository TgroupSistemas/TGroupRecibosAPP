import React from 'react';
import { eliminarProducto } from "../app/utils";
import { useUpdateTrigger } from "../app/context";
import PDFViewer from "@/components/PDFViewer";

interface Recibo {
  ARCHIVO: string;
  ESTADO_FIRMA: string;
  FECHA_ESTADO_FIRMA: string | null;
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
}
const getTipoLiquidacion = (tipo: string): string => {
  switch (tipo) {
    case 'V':
      return 'Vacaciones';
      case 'M':
        return 'Mensual';
      case 'J':
        return 'Jornal';
      case 'F':
        return 'F?';
    default:
      return tipo;
  }
};



const ReciboCard: React.FC<ReciboCardProps> = ({ recibo, index }) => {
  const tipoLiquidacion = getTipoLiquidacion(recibo.TIP_LIQ);
  const cardClassName = `btn border-none text-white  w-28  ${recibo.ESTADO_FIRMA !== 'X' ? 'bg-verde' : 'bg-slate-500'}`;
  return (
    <div key={index} className="flex justify-between items-center bg-gray-200 p-4 rounded-lg mb-2">
      <div className="text-black">{tipoLiquidacion} - {recibo.PERIODO} - {recibo.ESTADO_FIRMA} </div>
      <div className="flex space-x-2">
        <button className="btn border-none btn-primary text-white w-28 bg-slate-500">Ver en detalle</button>
        <button className={cardClassName}>          {recibo.ESTADO_FIRMA === 'X' ? 'Firmado' : 'Firmar'}
        </button>
      </div>
    </div>
  );
}

export default ReciboCard;