import React, { useState, useEffect } from "react";
import { useUpdateTrigger } from "../app/context";
import { useAppContext } from "@/contexts/AppContext";

interface FirmaProps {
  setPopUpFirmaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  estado: number;
  id: string;
  empresa: string;
}
export default function Firma(props: FirmaProps) {
  const { updateReciboFirmado, updateComentarioRecibo, recibosFirmaLoading } = useAppContext();
  const [step, setStep] = useState(props.estado);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [estadoLoadFirma, setEstadoLoadFirma] = useState("");
  const title = ["Firma en conformidad ", "Agregar comentario"];
  const message = [
    "Al presionar el siguiente botón estarás firmando que estás conforme con el recibo de sueldo.",
    "Escribí un comentario indicando si hay algo que no te parece correcto en el recibo de sueldo.",	
  ];
  const closePopup = () => {
    props.setPopUpFirmaOpen(false); // or any other value that indicates the popup should be closed
  };
  const handleClick = () => {
    setEstadoLoadFirma("F");

    updateReciboFirmado(props.id, "F", "", props.empresa).then((response: any) => {
    });
  };
  useEffect(() => {
    if (recibosFirmaLoading == false && (estadoLoadFirma === "F" || estadoLoadFirma === "X")) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000); 

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }
  }, [recibosFirmaLoading]);
  const handleClick2 = () => {

    if (motivo == "") {
      setError("No se puede dejar el campo vacío");
      return;}

      setEstadoLoadFirma("X");

      updateComentarioRecibo(props.id, motivo, props.empresa).then((response: any) => {
    });
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
      onClick={closePopup}
    >
      {" "}
      <div
        className="bg-white p-8 rounded-lg shadow md:w-3/6 mx-4 mt-10 "
        onClick={(e) => e.stopPropagation()}
      >{(estadoLoadFirma === "F" || estadoLoadFirma === "X") ? (
        recibosFirmaLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-infinity loading-lg"></span>
          </div>
      ):(<div className={`${estadoLoadFirma === "F" ? "text-green-700" : "text-indigo-700"} px-4 py-3 rounded relative text-center`} role="alert">
          <strong className="font-bold">
            {estadoLoadFirma === "F" ? "¡Firmado exitosamente!" : "¡Comentario agregado exitosamente!"}
          </strong>
          <span className="block sm:inline"> Aguarde para ser redirigido.</span>
        </div>)
      ) : (
        <><h2 className="text-xl font-bold mb-4 text-black">
              {title[step - 1]}{" "}
            </h2><div className=" justify-center">
                <h3 className="font-bold mb-4 text-gray-600">{message[step - 1]} </h3>
                {step === 1 && (
                  <div>
                    <button
                      className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-4"
                      onClick={handleClick}
                    >
                      Confirmar
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">
                      Comentario
                    </label>
                    <input
                      type="text"
                      id="motivo"
                      onChange={(e) => setMotivo(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2 " />
                    {error !== "" && ( 
                    <p className="text-red-500  italic">{error}</p>
                    )}  


                    <button className="px-4 py-2 mr-2 w-full bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-all mt-1" onClick={handleClick2}>
                      Agregar comentario
                    </button>
                  </div>
                )}
              </div></>
 )}
      </div>
    </div>
  );
}
