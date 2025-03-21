import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { differenceInDays, set } from "date-fns";


interface PopUpLicProps {
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

const PopUpLicencia: React.FC<PopUpLicProps> = ({
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
            <h1 className="text-lg text-gray-500 font-bold mb-5">
              <span className="text-black font-bold">
            {(() => {
            switch (notificacionArray[notiAbierta].TIPO_LIC) {
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
            </span>
            <br />

            {new Date(notificacionArray[notiAbierta].FEC_DES).toLocaleDateString() === new Date(notificacionArray[notiAbierta].FEC_HAS).toLocaleDateString()
          ? new Date(notificacionArray[notiAbierta].FEC_DES).toLocaleDateString()
          : `${new Date(notificacionArray[notiAbierta].FEC_DES).toLocaleDateString()} - ${new Date(notificacionArray[notiAbierta].FEC_HAS).toLocaleDateString()}`}
                
            </h1>

                   
                    <>
              <span className="text-base">Días:</span>
              <p className="text-lg font-semibold mb-3 border p-5 border-gray-400 rounded-md  ">
              {differenceInDays(new Date(notificacionArray[notiAbierta].FEC_HAS), new Date(notificacionArray[notiAbierta].FEC_DES)) + 1}{" "}
              {differenceInDays(new Date(notificacionArray[notiAbierta].FEC_HAS), new Date(notificacionArray[notiAbierta].FEC_DES)) + 1 === 1 ? "día" : "días"}
              </p>
              </>
            <>
              <span className="text-base">Notas:</span>
              {notificacionArray[notiAbierta].NOTAS ? (
              <p className="text-lg font-semibold mb-3 border p-5 border-gray-400 rounded-md">
                {notificacionArray[notiAbierta].NOTAS}
              </p>
              ) : (
              <p className="text-gray-500">No hay notas</p>
              )}
            </>

              <div className="mt-3">
              <span className="text-base ">Archivos:</span>
              <div className="flex flex-col space-y-2">

                {((notificacionArray[notiAbierta].ARCHIVOS ?? '').trim() === '') || (notificacionArray[notiAbierta].ARCHIVOS == "undefined") ? (
                  <p className="text-gray-500">No hay archivos</p>
                ) : (
                  (notificacionArray[notiAbierta].ARCHIVOS ?? '').split('|').reduce((acc: any[], curr: string, index: number, array: string[]) => {
                  if (index % 2 === 0 && array[index + 1]) {
                    acc.push([curr, array[index + 1]]);
                  }
                  return acc;
                  }, []).map(([descripcion, ruta]: [string, string], index: number) => {
                  const isPDF = ruta.toLowerCase().endsWith('.pdf');
                  return (
                    <div key={index} className="flex items-center space-x-2 border p-2 border-gray-400 rounded-md">
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-200 text-gray-700 font-bold">
                      {isPDF ? "PDF" : "IMG"}
                    </div>
                    <span className="text-base font-semibold"><span className="font-bold">Descripción: </span><br /> {descripcion}</span>
                    </div>
                  );
                  })
                )}
              </div>
              </div>
            
            <div className="flex justify-center mt-4">
                <button
                onClick={() => setNotiEstado(false)}
                className="text-white bg-grisclaro2 hover:bg-grisclaro rounded-lg px-10 py-2 shadow-md transition duration-300 ease-in-out transform "
                >
                Cerrar
                </button>
            </div>
      </div>
    </div>
  );
};

export default PopUpLicencia;
