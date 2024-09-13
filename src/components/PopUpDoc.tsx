import React, { useState, useEffect } from 'react';

import PDFViewer from "@/components/PDFViewer";
import Firma from './Firma';

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
interface PopUpDocProps {
  reciboRecibido: Recibo ;
  cerrar: React.Dispatch<React.SetStateAction<boolean >>;
  empresa: string;

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
        return 'Liquidación Final';	
    default:
      return tipo;
  }
};

const PopUpDoc: React.FC<PopUpDocProps> = ({ reciboRecibido, cerrar, empresa }) => {
  const tipoLiquidacion = getTipoLiquidacion(reciboRecibido.TIP_LIQ);
  const [popUpFirmaOpen, setPopUpFirmaOpen] = useState(false);
  const [estadoFirma, setEstadoFirma] = useState(1);
  return (
<div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
      
    >      <div className="bg-white text-slate-600  pt-4 px-4 md:p-8 rounded-lg shadow w-full lg:w-4/6 md:w-4/5 mx-3 h-fit mt-10">
      
        <h2 className="text-xl text-black font-bold mb-3">{tipoLiquidacion} - {reciboRecibido.PERIODO}</h2>
        <p><span className='font-bold '>Estado: </span>          {
            reciboRecibido.ESTADO_FIRMA === "F" ? "Firmado" :
            reciboRecibido.ESTADO_FIRMA === "X" ? "Firmado en disconformidad" :
            "Sin firma"
          }</p> 
        {reciboRecibido.ESTADO_FIRMA === "X" || reciboRecibido.ESTADO_FIRMA === "F" ? (
        <p><span className='font-bold '>Fecha de firma: </span>{
          new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(reciboRecibido.FECHA_ESTADO_FIRMA))
        }</p> ) : null}
        {reciboRecibido.ESTADO_FIRMA === "X" && (
          <p><span className='font-bold'>Motivo de disconformidad: </span>{reciboRecibido.MOTIVO_DISCONFORMIDAD}</p>
        )}                <div className="flex justify-betwee w-full mt-3">

        <button
            className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all"
            onClick={() => {setPopUpFirmaOpen(true), setEstadoFirma(1)}}

          >
            Firmar
          </button>
          <button
            className="px-4 py-2 w-full bg-rojo text-white rounded hover:bg-red-700 transition-all"
            onClick={() => {setPopUpFirmaOpen(true), setEstadoFirma(2)}}
          >
            Firmar en disconformidad
          </button>
          
        </div>
        
        <p className="mb-4"></p>
        <div style={{ height: '30em' }} className=''>        <PDFViewer id={reciboRecibido.ARCHIVO}></PDFViewer>
        </div>
        <button
            className="px-4 py-2 mb-3 w-full mt-15 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-all"
           onClick={() => cerrar(false)}
          >
            Cerrar
          </button>
      </div>
      {popUpFirmaOpen == true && (
      <Firma setPopUpFirmaOpen={setPopUpFirmaOpen} estado={estadoFirma} id={reciboRecibido.ID} empresa={empresa}></Firma>
      )}
    </div>
  );
}

export default PopUpDoc;