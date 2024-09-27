import React, { useState, useEffect } from "react";

import { useAppContext } from "@/contexts/AppContext";
interface mailProps {
  hasPass: boolean;
  mail: string;
  mailv: string;
  tyc: string;
}
export default function MailPassword(props: mailProps) {
  const [step, setStep] = useState(props.tyc !== "true" ? 3 : 0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const correo = props.mail
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const { changePassword, ponerMail, correoLoading, aceptarTerminos} = useAppContext();
  const [timer, setTimer] = useState(61);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
function censorEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  const censoredLocalPart = localPart.slice(0, 2) + '*****' + localPart.slice(-1);
  return `${censoredLocalPart}@${domain}`;
}

  const title = [
    "Verificación de identidad",
    "Verificación de identidad",
    "Nueva contraseña",
    "Términos y condiciones"
  ];
  const message = [
    "Para verificar tu identidad enviaremos un correo electrónico a la casilla vinculada con tu cuenta (" + censorEmail(props.mail) + ")",
    "Ya enviamos el correo, revisá tu casilla de email",
    "Creá una nueva contraseña para tu cuenta.",
    "Para continuar, aceptá los términos y condiciones"
  ];
  const sendVerificationEmail = async (email: string, code: string) => {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      throw new Error("Failed to send verification email");
    }
  };
  const addVerificationCodeToCookie = (verificationCode: string) => {
    const cookieName = "cod";
    const cookieString = document.cookie
      .split("; ")
      .find((row) => row.startsWith(cookieName + "="));

    let codesArray: string[] = [];
    if (cookieString) {
      try {
        const cookieValue = decodeURIComponent(cookieString.split("=")[1]);
        codesArray = JSON.parse(cookieValue);
        if (!Array.isArray(codesArray)) {
          codesArray = [];
        }
      } catch (e) {
        console.error("Error parsing cookie:", e);
        codesArray = [];
      }
    }

    codesArray.push(verificationCode);

    document.cookie = `${cookieName}=${encodeURIComponent(
      JSON.stringify(codesArray)
    )}; max-age=28800; path=/`;
  };
  useEffect(() => {
    if (step == 1) {
      if (timer > 0) {
        const countdown = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        return () => clearInterval(countdown);
      } else {
        setIsButtonDisabled(false);
      }
    }
  }, [timer]);

  const getCookieAsArray = (cookieName: string): string[] => {
    const cookieString = document.cookie
      .split("; ")
      .find((row) => row.startsWith(cookieName + "="));

    let codesArray: string[] = [];
    if (cookieString) {
      try {
        const cookieValue = decodeURIComponent(cookieString.split("=")[1]);
        codesArray = JSON.parse(cookieValue);
        if (!Array.isArray(codesArray)) {
          codesArray = [];
        }
      } catch (e) {
        console.error("Error parsing cookie:", e);
        codesArray = [];
      }
    }
    return codesArray;
  };
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const envio = async () => {
    setTimer(60);
    setIsButtonDisabled(true);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // Generar código de 6 dígitos
    addVerificationCodeToCookie(verificationCode);
    console.log(correo, verificationCode);
    await sendVerificationEmail(correo, verificationCode);
  };

  async function handleClick(): Promise<void> {
    if(step == 3)
    {
      await aceptarTerminos()
      if(props.mailv != 'true')
      {
        setStep(0)
      }

    }
    if (step === 0) {

        envio();
        setStep(1);

    }
    if (step === 1) {
      const cookiesArray = getCookieAsArray("cod");
      console.log(cookiesArray, verificationCode);
      if (!cookiesArray.includes(verificationCode)) {
        setError("Código de verificación incorrecto");
        return;
      }
      if(props.hasPass == true)
      {
        await ponerMail()
      }
      else{
        setStep(2);

      }
    }
    if (step === 2) {
    }
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value);
  };


  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(password, confirmPassword);
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      const response = await changePassword({
        password,
        confirmPassword,
      });
      await ponerMail()
      
    }
  };

  return (
    <div
      className={`fixed inset-0 z-10 flex  items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
    >
      {" "}
      <div className="bg-white p-8 rounded-lg shadow w-4/5 md:w-3/6  mt-10 ">
        <h2 className="text-xl font-bold mb-4 text-black">{title[step]}</h2>
        <div className=" justify-center">

          <h3 className="font-bold  text-gray-600 mb-2">{message[step]} </h3>
          
          {step === 3 && (
            <div>
              <button
                className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-1"
                onClick={() => handleClick()}
              >
                Aceptar
              </button>
            </div>
          )}
            
          {step === 0 && (
            <div>
              <button
                className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-1"
                onClick={() => handleClick()}
              >
                Enviar codigo de verificación
              </button>
            </div>
          )}

          {step === 1 && (
            <div>

              <label className="block text-sm font-medium text-gray-700">
                Código de verificación
              </label>
              <input
                type="text"
                id="verificationCode"
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2 "
              />

              <span className="mb-4">
                ¿No te llegó el correo?{" "}
                <button
                  className={`   ${
                    isButtonDisabled
                      ? "cursor-not-allowed text-slate-600"
                      : "cursor-pointer text-blue-600"
                  }`}
                  onClick={() => envio()}
                  disabled={isButtonDisabled}
                >
                  {" "}
                  Reenviar
                </button>{" "}
                en {timer} segundos
              </span>
              <p className="text-red-500 text-sm mt-2">{error}</p>
              <button
                className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-4"
                onClick={() => handleClick()}
              >
                Confirmar
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Contraseña
              </label>
              <input
                required
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2 "
              />

              <label className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                required
                type="password"
                id="verificationCode"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2 "
              />
              <p className="text-red-500 text-sm mt-2">{error}</p>

              <button
                className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-4"
                onClick={handleSubmit}
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
        <p className="mb-4"></p>
      </div>
    </div>
  );
}
