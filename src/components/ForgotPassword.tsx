import React, { useState, useEffect } from "react";

import { useAppContext } from "@/contexts/AppContext";
interface forgotProps { 
  setPopUpForgotOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ForgotPassword(props: forgotProps) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dni, setDNI] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const { changePassword, ponerMail, correoLoading, enviarMailRecuperacion } = useAppContext();
  const [timer, setTimer] = useState(61);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
function censorEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  const censoredLocalPart = localPart.slice(0, 2) + '*****' + localPart.slice(-1);
  return `${censoredLocalPart}@${domain}`;
}

  const title = [
    "Recuperación de contraseña",
    "Recuperación de contraseña"
  ];
  const message = [
    "Enviaremos un correo electrónico a la casilla vinculada con tu cuenta con una nueva contraseña segura",
    "Ya enviamos el correo, revisá tu casilla de correo electrónico"
  ];
  

  const generateSecurePassword = (length: number = 12): string => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*_+?-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };



  async function handleClick(): Promise<void> {
    setError("");

    if (step === 0) {
      if (dni === "") {
        setError("Completá el campo para avanzar");
        return;
      }
      const nuevaContraseña = generateSecurePassword()
      const resultado = await enviarMailRecuperacion(dni, nuevaContraseña);
      if (resultado) {
        setStep(1);
      }
      else {
        setError("El DNI ingresado no se encuentra registrado en el sistema");
      }

    }
    if (step === 1) {

    }

  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDNI(event.target.value);
  };


  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
      onClick={() => props.setPopUpForgotOpen(false)}
    >
      {" "}
      <div className="bg-white p-8 rounded-lg shadow w-4/5 md:w-3/6 	  mt-10 "
      onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-black">{title[step]}</h2>
        <div className=" justify-center">

          <h3 className="font-bold  text-gray-600 mb-2">{message[step]} </h3>
          
            
          {step === 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-3">
                Ingresa tu DNI
              </label>
            <input id="dni" name="dni" type="number" onChange={e => setDNI(e.target.value)}   required className="block  w-full rounded-md border-0 py-2 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 mb-2 mt-2 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>

            <p className="text-red-500 text-sm mt-0 mb-2">{error}</p>

              <button
                className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-1"
                onClick={() => handleClick()}
              >
                Enviar
              </button>
            </div>
          )}

          {step === 1 && (
            <div>

            
              <button
                className="px-4 py-2 mr-2 w-full bg-gray-400 text-white rounded hover:bg-gray-500 transition-all mt-4"
                onClick={() => props.setPopUpForgotOpen(false)}
              >
                Cerrar
              </button>
            </div>
          )}
          
        </div>
        <p className="mb-4"></p>
      </div>
    </div>
  );
}
