import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";


interface PopUpNotiProps {
  notificacionArray: any;
  notiAbierta: number;
  setNotiEstado: React.Dispatch<React.SetStateAction<boolean>>;

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

const PopUpNotification: React.FC<PopUpNotiProps> = ({
  notificacionArray,
  notiAbierta,
  setNotiEstado,
}) => {

  return (
    <div
      className={`fixed inset-0 flex items-center top-16 md:pt-0 pt-20 overflow-y justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
    >
      {" "}
      <div
        style={{ maxHeight: "80vh" }}
        className="bg-white text-slate-600 pt-4 px-4 lg:h-min md:h-5/6 h-full md:p-8 rounded-lg shadow w-full lg:w-4/6 md:w-4/5  min-h-5/6 overflow-y-auto mt-10"
      >
            <h1 className="text-lg text-gray-500 font-bold mb-1">
                {new Date(notificacionArray[notiAbierta].FECHA_HORA).toLocaleDateString()}
            </h1>
                    <p className="text-lg text-black font-semibold mb-3" dangerouslySetInnerHTML={{ __html: notificacionArray[notiAbierta].NOTAS }}>
             
            </p>
            <div className="flex justify-center mt-4">
                <button
                onClick={() => setNotiEstado(false)}
                className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-10 py-2 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                Cerrar
                </button>
            </div>
      </div>
    </div>
  );
};

export default PopUpNotification;
