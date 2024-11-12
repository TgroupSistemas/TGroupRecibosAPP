import React, { useState, useEffect, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "@/contexts/AppContext";
interface mailProps {
  hasPass: boolean;
  mail: string;
  mailv: string;
  tyc: string;
  vdp: string;
}
export default function MailPassword(props: mailProps) {
  console.log("ASDA", props.vdp);
  const [step, setStep] = useState(() => {
    if (props.tyc === "true") {
      return (props.vdp !== "F" && props.vdp !== "F" ) ? 4 : 0;
    } else {
      return 3;
    }
  });

  const [email, setEmail] = useState("");
  const [datoIncorrecto, setDatoIncorrecto] = useState("");
  const [errorDato, setErrorDato] = useState("");
  const [error, setError] = useState("");
  const [stepDatos, setStepDatos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [datosUsuario, setDatosUsuario] = useState({});
  const [verificationCode, setVerificationCode] = useState("");
  const correo = props.mail;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);	
  const {
    changePassword,
    ponerMail,
    correoLoading,
    aceptarTerminos,
    traerDatosPerfil,
    getCookie,
    setVDP,
  } = useAppContext();
  const [timer, setTimer] = useState(61);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  function censorEmail(email: string): string {
    const [localPart, domain] = email.split("@");
    const censoredLocalPart =
      localPart.slice(0, 2) + "*****" + localPart.slice(-1);
    return `${censoredLocalPart}@${domain}`;
  }

  const title = [
    "Verificación de identidad",
    "Verificación de identidad",
    "Nueva contraseña",
    "Términos y condiciones",
    "Aceptar datos personales",
  ];
  const message = [
    "Para verificar tu identidad enviaremos un correo electrónico a la casilla vinculada con tu cuenta (" +
      censorEmail(props.mail) +
      ")",
    "Ya enviamos el correo, revisá tu casilla de email",
    "Creá una nueva contraseña para tu cuenta.",
    "Para continuar, aceptá los términos y condiciones",
    "Verificá tus datos personales para continuar",
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

  useEffect(() => {
    const fetchData = async () => {
      console.log("Step:", step);
      if (step === 4) {
        setLoading(true);
        const username = await getCookie("username");
        const data = await traerDatosPerfil(username);
        setDatosUsuario(data);
        setLoading(false);
      }
    };
    fetchData();
  }, [step]);

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

  async function handleClick(ver: string = ""): Promise<void> {
    if (step == 3) {
      await aceptarTerminos();
      if (props.mailv != "true") {
        setStep(0);
      }
      if (props.vdp != "F" && props.vdp != "X") {
        setStep(4);
      }
    }
    if (step == 4) {
      if (ver === "X") {
        if (datoIncorrecto === "") {
          setErrorDato("Campo requerido");
          return;
        }
        setVDP(ver, datoIncorrecto);
      }
      else{
        setVDP(ver);

      }
      if (props.hasPass != true) {
        setStep(2);
      }
      if (props.mailv != "true") {
        setStep(0);
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
      if (props.hasPass == true) {
        await ponerMail();
      } else {
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
      await ponerMail();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-10 flex md:pt-0 pt-10 items-center justify-center bg-black bg-opacity-50 transition-opacity   duration-500`}
    >
      {" "}
      <div className="bg-white px-8 pt-6 pb-3 rounded-lg shadow w-4/5 md:w-3/6 mt-10 ">
        <h2 className="text-xl font-bold mb-4 text-black">{title[step]}</h2>
        <div className=" justify-center">
          <h3 className="font-bold  text-gray-600 mb-2">{message[step]} </h3>

          {step === 3 && (
            <div>
              <div className="max-h-80 overflow-y-auto p-4 border border-gray-300 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-bold">
                    TÉRMINOS Y CONDICIONES DE USO DEL PORTAL DE SUELDOS
                  </span>
                  <br />
                  <br />
                  1. Objeto de los Términos y Condiciones
                  <br />
                  El presente documento tiene como objetivo definir las reglas
                  que rigen el uso del Portal de Sueldos TGroup por parte de los
                  empleados de las empresas que contratan este servicio. Al
                  acceder y utilizar el Portal de Sueldos, usted acepta
                  plenamente y sin reservas todos los términos y condiciones
                  aquí establecidos.
                  <br />
                  <br />
                  2. Validez de la Firma Electrónica
                  <br />
                  El usuario acepta que la firma electrónica realizada a través
                  del Portal de Sueldos tiene plena validez legal y es
                  equivalente a una firma manuscrita. Al firmar electrónicamente
                  sus recibos de sueldos, usted acepta su contenido y da fe de
                  que los datos incluidos en dichos recibos son correctos.
                  TGroup SAS proporciona únicamente el software para la firma
                  electrónica y no es responsable del contenido de los
                  documentos firmados a través de la plataforma.
                  <br />
                  <br />
                  En caso de disputa legal sobre la validez de una firma
                  electrónica, TGroup SAS se compromete a proporcionar toda la
                  información técnica necesaria que esté a su disposición, a
                  solicitud de las autoridades competentes. Sin embargo, TGroup
                  SAS no se hace responsable de las disputas relacionadas con el
                  contenido de los documentos firmados ni con la relación
                  laboral entre la empresa y el empleado.
                  <br />
                  <br />
                  3. Registro y Acceso al Portal
                  <br />
                  Para acceder al Portal de Sueldos, el empleado deberá
                  registrarse con su DNI y la contraseña proporcionada por su
                  empleador. Durante el primer acceso, el sistema le solicitará
                  la validación de su dirección de correo electrónico, a través
                  de un código de verificación que será enviado a su casilla de
                  email.
                  <br />
                  <br />
                  El acceso al Portal es personal e intransferible, siendo el
                  empleado el único responsable de la seguridad de sus
                  credenciales. Usted se compromete a mantener su contraseña
                  segura y a no compartirla con terceros. Cualquier actividad
                  realizada con su cuenta será de su exclusiva responsabilidad.
                  <br />
                  <br />
                  4. Verificación y Actualización de Datos Personales
                  <br />
                  En su primer ingreso al Portal de Sueldos, el empleado deberá
                  revisar y confirmar la veracidad de sus datos personales. Si
                  los datos mostrados no son correctos, deberá informar los
                  cambios necesarios utilizando el formulario de corrección
                  disponible en la plataforma.
                  <br />
                  <br />
                  Es responsabilidad del empleado mantener sus datos personales
                  actualizados. En caso de que los datos cambien, el sistema le
                  mostrará nuevamente la opción de confirmación hasta que los
                  mismos sean verificados y aceptados.
                  <br />
                  <br />
                  5. Firma de Recibos de Sueldos
                  <br />
                  El Portal de Sueldos permite al usuario firmar
                  electrónicamente sus recibos de sueldos. Existen dos opciones:
                  <br />
                  <br />
                  Firma en Conformidad: El empleado acepta el recibo de sueldos
                  sin objeciones. Firma en Disconformidad: El empleado podrá
                  firmar expresando su disconformidad, indicando los motivos que
                  justifiquen su desacuerdo con los conceptos reflejados en el
                  recibo. Al firmar un recibo, el siguiente recibo pendiente de
                  firma se habilitará automáticamente. La firma de un recibo es
                  un requisito indispensable para poder acceder a la firma de
                  los siguientes.
                  <br />
                  <br />
                  6. Descarga e Impresión de Recibos
                  <br />
                  El usuario tiene la opción de descargar e imprimir sus recibos
                  de sueldos en formato PDF una vez que estos hayan sido
                  firmados. Los recibos estarán disponibles en el portal para
                  ser consultados y descargados en cualquier momento, mientras
                  la relación laboral continúe vigente y el servicio esté
                  activo.
                  <br />
                  <br />
                  7. Suspensión o Cancelación del Servicio
                  <br />
                  TGroup SAS se reserva el derecho de suspender o cancelar el
                  acceso al Portal de Sueldos si se detecta alguna irregularidad
                  en su uso, tales como intentos de fraude, accesos no
                  autorizados, o incumplimiento de cualquiera de los términos
                  aquí descritos. En caso de suspensión, el empleado no podrá
                  acceder al portal hasta que se resuelvan las irregularidades
                  detectadas.
                  <br />
                  <br />
                  8. Responsabilidad del Usuario
                  <br />
                  El usuario es el único responsable de las acciones realizadas
                  en el Portal de Sueldos utilizando sus credenciales. Cualquier
                  incumplimiento de las reglas establecidas en estos términos y
                  condiciones puede derivar en la suspensión o cancelación de su
                  acceso a la plataforma.
                  <br />
                  <br />
                  9. Exoneración de Responsabilidad
                  <br />
                  TGroup SAS no se responsabiliza por los posibles fallos
                  técnicos, interrupciones del servicio o errores derivados del
                  uso de la plataforma que sean atribuibles a problemas en la
                  red de Internet, el hardware o el software del usuario.
                  Además, TGroup SAS no se hace responsable por la incorrecta
                  utilización del Portal de Sueldos ni por la imposibilidad de
                  acceder al mismo debido a causas externas a su control.
                  <br />
                  <br />
                  10. Seguridad y Confidencialidad
                  <br />
                  Todas las comunicaciones entre el Portal de Sueldos y el
                  usuario están protegidas mediante cifrado para garantizar la
                  confidencialidad de los datos. Sin embargo, es responsabilidad
                  del empleado adoptar las medidas de seguridad necesarias en su
                  dispositivo, como la instalación de antivirus o el uso de
                  firewalls, para proteger sus datos personales y laborales.
                  <br />
                  <br />
                  11. Actualización de los Términos y Condiciones
                  <br />
                  TGroup SAS se reserva el derecho de modificar estos términos y
                  condiciones en cualquier momento. Los cambios entrarán en
                  vigor una vez publicados en el portal. El uso continuo del
                  Portal de Sueldos después de la modificación de los términos
                  constituirá la aceptación de los mismos.
                  <br />
                  <br />
                  12. Aceptación de los Términos
                  <br />
                  Al utilizar el Portal de Sueldos TGroup, usted declara haber
                  leído, comprendido y aceptado en su totalidad estos términos y
                  condiciones. Si no está de acuerdo con alguna de las
                  condiciones, deberá abstenerse de utilizar el portal.
                </p>
              </div>
              <button
                className="px-4 py-2 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-1"
                onClick={() => handleClick()}
              >
                Aceptar
              </button>
            </div>
          )}

          {step === 4 &&
            (!loading ? (
              <div>
                <div className=" max-h-56 overflow-y-auto p-4 mb-3 border border-gray-300 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 pb-6">
                    {Object.entries(datosUsuario).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="font-medium text-gray-900">{key}</span>
                        <span className="text-gray-500">
                          {String(value) || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>{" "}
                {stepDatos === 0 ? (
                  <>
                <button
                  className="px-1 py-3 mr-2 w-full bg-verde text-white rounded hover:bg-green-700 transition-all mt-1"
                  onClick={() => handleClick("F")}
                >
                  Los datos son correctos
                </button>

                  <button
                    className="px-1 py-3 mr-2 mt-2 w-full bg-rojo text-white rounded hover:bg-red-700 transition-all mt-1"
                    onClick={() => setStepDatos(1)}
                  >
                    Hay datos incorrectos
                  </button>
                  </>
                ) : (
                  <>
                  <label htmlFor="dni" className="block text-md mb-2 mt-4 font-medium leading-6 text-gray-900">Indicanos que datos son incorrectos</label>

                  <input type="text" id="datoIncorrecto" onChange={e => setDatoIncorrecto(e.target.value)} className="block pl-2  w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  {errorDato && <span className="text-red-500">{errorDato}</span>}

                  <button
                    className="px-1 py-3 mr-2 mt-2 w-full bg-rojo text-white rounded hover:bg-red-700 transition-all mt-1"
                    onClick={() => handleClick("X")}
                  >
                    Enviar
                  </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="loading loading-infinity loading-lg"></span>
              </div>
            ))}

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
                <div className="relative">
                <input
                  required
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                  ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </button>
                </div>

                <label className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
                </label>
                <div className="relative">
                <input
                  required
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm mb-2"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showConfirmPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                  ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </button>
                </div>
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
