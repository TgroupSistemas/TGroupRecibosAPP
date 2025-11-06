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
  const [step, setStep] = useState<number>(() => {
    if (props.tyc === "true") {
      if (props.vdp !== "F" && props.vdp !== "X") {
        return 4;
      } else {
        if (props.mailv !== "true") {
          return 0;
        } else {
          if (props.hasPass !== true) {
            return 2;
          }
          return 0;
        }
      }
    }
    return 0;
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
    TÉRMINOS Y CONDICIONES DE USO DEL PORTAL SUELDOS
  </span>
  <br/><br/>

  1. Objeto de los Términos y Condiciones<br/>
  El presente documento tiene como objetivo definir las reglas que rigen el uso del Portal Web Sueldos para la Administración de Recursos Humanos TGROUP, en adelante “Portal Sueldos”, por parte de los empleados de las empresas que contratan este servicio.
  Al acceder y utilizar el Portal Sueldos, usted acepta plenamente y sin reservas todos los términos y condiciones aquí establecidos, incluyendo la utilización de las funcionalidades disponibles como la firma digital de recibos de sueldos, las notificaciones del empleador, la carga de solicitudes de licencias y la gestión de documentación personal.
  <br/><br/>

  2. Validez de la Firma Electrónica<br/>
  El usuario acepta que la firma electrónica realizada a través del Portal Sueldos tiene plena validez legal y es equivalente a una firma manuscrita. Al firmar electrónicamente sus recibos de sueldos, usted acepta su contenido y declara que los datos incluidos son correctos.
  TGROUP SAS proporciona exclusivamente la herramienta tecnológica para la firma digital y no es responsable del contenido de los documentos firmados. En caso de disputa legal, TGROUP SAS se compromete a colaborar técnicamente con las autoridades competentes, pero no se responsabiliza por el contenido de los documentos ni por la relación laboral entre la empresa y el empleado.
  <br/><br/>

  3. Registro y Acceso al Portal<br/>
  El acceso al Portal Sueldos requiere que el empleado se registre con su DNI y contraseña proporcionada por su empleador. Durante el primer ingreso se solicitará la verificación del correo electrónico personal a través de un código enviado por mail.
  El acceso es personal e intransferible, siendo responsabilidad del usuario custodiar sus credenciales de ingreso. Toda acción realizada en el Portal será considerada de su exclusiva autoría.
  <br/><br/>

  4. Verificación y Actualización de Datos Personales<br/>
  En el primer acceso, el empleado deberá verificar sus datos personales y confirmar su validez. En caso de detectar errores, deberá informar los cambios a través del formulario de corrección disponible.
  Será responsabilidad del usuario mantener actualizados sus datos personales en el Portal.
  <br/><br/>

  5. Funcionalidades Disponibles en el Portal Sueldos<br/>
  El Portal Sueldos permite al usuario:<br/>
  - Actualizar sus datos personales y de contacto.<br/>
  - Recibir notificaciones y comunicaciones de parte de su empleador.<br/>
  - Cargar solicitudes de licencias (vacaciones, enfermedad, etc.) y adjuntar la documentación correspondiente.<br/>
  - Consultar el historial de solicitudes y documentación cargada.<br/>
  - Visualizar y firmar electrónicamente sus recibos de sueldo.<br/>
  - Descargar e imprimir recibos firmados.<br/>
  El uso de estas funcionalidades implica la aceptación expresa de los términos y condiciones aquí descriptos.
  <br/><br/>

  6. Firma de Recibos de Sueldo<br/>
  La firma digital de recibos es un requisito indispensable para poder acceder a los recibos siguientes. El empleado podrá agregar comentarios en caso de disconformidad con los conceptos liquidados.
  <br/><br/>

  7. Descarga e Impresión de Recibos<br/>
  Los recibos de sueldo firmados estarán disponibles en el Portal para su consulta y descarga en cualquier momento mientras dure la relación laboral y el servicio esté activo.
  <br/><br/>

  8. Suspensión o Cancelación del Servicio<br/>
  TGROUP SAS se reserva el derecho de suspender o cancelar el acceso al Portal Sueldos si se detectan irregularidades en su uso o incumplimientos de estos términos y condiciones.
  <br/><br/>

  9. Responsabilidad del Usuario<br/>
  El usuario es responsable por las acciones realizadas en el Portal utilizando sus credenciales. El incumplimiento de los términos podrá derivar en la suspensión del servicio.
  <br/><br/>

  10. Exoneración de Responsabilidad<br/>
  TGROUP SAS no se responsabiliza por fallos técnicos, problemas de conectividad o errores que no le sean atribuibles directamente.
  <br/><br/>

  11. Seguridad y Confidencialidad<br/>
  La información transmitida a través del Portal está protegida mediante protocolos de seguridad y cifrado. El usuario es responsable de mantener condiciones de seguridad adecuadas en su dispositivo de acceso.
  <br/><br/>

  12. Actualización de los Términos y Condiciones<br/>
  TGROUP SAS podrá modificar estos términos en cualquier momento. Las modificaciones se considerarán aceptadas al continuar utilizando el Portal.
  <br/><br/>

  13. Aceptación de los Términos<br/>
  Al utilizar el Portal Sueldos, usted declara haber leído, comprendido y aceptado en su totalidad estos términos y condiciones.
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
