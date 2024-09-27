import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import {
  logeo,
  enviarClase,
  cambioPassword,
  traerEndpoint,
  getRegistroUnico,
  LbGetClases,
  LbRegistroClase,
  getRecibos,
  updateRecibo,
  updateCorreo,
  getTokenAPI,
  mailUsuario,
  postLog,
  aceptarTYC,
  traerPDF
} from "./APILibrary";
import bcrypt from "bcrypt-nodejs";
import dotenv from "dotenv";
dotenv.config();

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [mailVerificadoCambio, setMailVerificadoCambio] = useState(false);
  const [user, setUser] = useState("Usuario");
  const [tareas, setTareas] = useState({});
  const [responseLogin, setResponseLogin] = useState({});
  const [loggedIn, setLoggedIn] = useState(true);
  const [clasesHabilitadas, setClasesHabilitadas] = useState([]);
  const [claseLoading, setClaseLoading] = useState(false);
  const [registroActual, setRegistroActual] = useState(true);
  const [registroLoading, setRegistroLoading] = useState(true);
  const [endpointLoading, setEndpointLoading] = useState(true);
  const [endpointDataActual, setEndpointDataActual] = useState("");
  const [popUpSelectorActivo, setPopUpSelectorActivo] = useState(false);
  const [popUpFiltroActivo, setPopUpFiltroActivo] = useState(false);
  const [datosFormularioActual, setDatosFormularioActual] = useState({});
  const [campoPopUpActual, setCampoPopUpActual] = useState("");
  const [campoSelectorActivo, setCampoSelectorActivo] = useState("");
  const [paginaActualComponente, setPaginaActualComponente] = useState(1);
  const [endpointFiltroActual, setEndpointFiltroActual] = useState("");
  const [endpointActualPopUp, setEndpointActualPopUp] = useState("");
  const [hasPassw, setHasPassw] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [PDF, setPDF] = useState("");
  const [PDFLoading, setPDFLoading] = useState(true);
  const [recibosFirmaLoading, setRecibosFirmaLoading] = useState(false);
  const [logLoading, setLogLoading] = useState(false);
  const [tycCambio, setTycCambio] = useState(false);
  const [filtroEndpointActualFijoPopUp, setFiltroEndpointActualFijoPopUp] =
    useState("");
  const [errorAlert, setErrorAlert] = useState("");

  const loginUser = useCallback(async (credentials) => {
    credentials.empresa = "tgroup";
    const jsonArmado = JSON.stringify(credentials);
    const headers = {
      "content-type": "application/json; charset=utf-8",
    };
    try {
      const data = await logeo(credentials);
      if (data.status == 200) {
    
        setHasPassw(data.datos.PASSWORD != "" && data.datos.PASSWORD != null ? true : false);
        setResponseLogin(data);
        postLogRecibo(data.datos.FK_WS_CLIENTES, "L", "", data.datos.ID,);
        document.cookie = "isloggedin=" + await setCookie("true") + "; max-age=28800; path=/";
        document.cookie = `id=${await setCookie(data.datos.ID)}; max-age=28800; path=/`;
        document.cookie = `hasPassword=${await setCookie(data.datos.PASSWORD != "" && data.datos.PASSWORD != null? "true" : "false")}; max-age=28800; path=/`;
        document.cookie =
          "rs_elecom=" + await setCookie(data.datos.ELECOM_RS) + "; max-age=28800; path=/";
          document.cookie =
          "name=" + await setCookie(data.datos.FULLNAME) + "; max-age=28800; path=/";
        document.cookie =
          "fl_erp_empresas=" +
          await setCookie(data.datos.FK_WS_CLIENTES) +
          "; max-age=28800; path=/";
        document.cookie =
          "elecom_vendedor=" +
          await setCookie(data.datos.ELECOM_VENDEDOR) +
          "; max-age=28800; path=/";
        document.cookie =
          "username=" + await setCookie(data.datos.USERNAME) + "; max-age=28800; path=/";
        document.cookie =
          "mail=" + await setCookie(data.datos.EMAIL) + "; max-age=28800; path=/";
        document.cookie =
          "mailverificado=" + await setCookie(data.datos.EMAIL_VERIFICADO.toString()) + "; max-age=28800; path=/";
          document.cookie =
          "tyc=" + await setCookie(data.datos.ACEPTA_TYC.toString()) + "; max-age=28800; path=/"; 
        document.cookie =
          "fk_erp_contactos=" +
          await setCookie(data.datos.FK_ERP_CONTACTOS) +
          "; max-age=28800; path=/";
        document.cookie =
          "menu=" +
          await setCookie(JSON.stringify(data.datos.WS_DET_CLI_MENU)) +
          "; max-age=28800; path=/";
          document.cookie =
          "empresasHabilitadas=" +
          await setCookie(JSON.stringify(data.datos.WS_DET_CLI_EMPRESAS)) +
          "; max-age=28800; path=/";
          setLoggedIn(true);

        return true;

      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }, []);
  const logout = useCallback(async () => {
    document.cookie = "isloggedin=; max-age=0; path=/";
    document.cookie = "id=; max-age=0; path=/";
    document.cookie = `hasPassword=; max-age=0; path=/`;
    document.cookie = "rs_elecom=; max-age=0; path=/";
    document.cookie = "fl_erp_empresas=; max-age=0; path=/";
    document.cookie = "elecom_vendedor=; max-age=0; path=/";
    document.cookie = "username=; max-age=0; path=/";
    document.cookie = "fk_erp_contactos=; max-age=0; path=/";
    document.cookie = "menu=; max-age=0; path=/";
    document.cookie = "mailVerificado=; max-age=0; path=/";
    document.cookie = "cod=; max-age=0; path=/";
    document.cookie = "empresasHabilitadas=; max-age=0; path=/";
    document.cookie = "name=; max-age=0; path=/";
    document.cookie = "tyc=; max-age=0; path=/";

    setHasPassw(false);

    window.location.replace("/login");
  }, []);
  function formatNumberWithDots(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const getUsername = useCallback(async () => {
    if (await getCookie("username") == null) {
      return "TGROUP";
    }
    return (
      formatNumberWithDots(await getCookie("username"))
    );
  }, []);
  const getEmpresasHab = useCallback(async () => {
    if (await await getCookie("empresasHabilitadas") == null) {
      return [];
    }
    return (
      await getCookie("empresasHabilitadas")
    );
  }, []);
  const getEmpresaName = useCallback(async () => {
    if (await await getCookie("fl_erp_empresas") == null) {
      return "TGROUP";
    }
    return (
      await getCookie("fl_erp_empresas").charAt(0).toUpperCase() +
      await getCookie("fl_erp_empresas").slice(1).toLowerCase()
    );
  }, []);
  const getName = useCallback(async () => {
    if (await await getCookie("name") == null) {
      return "TGROUP";
    }
    return (
      await getCookie("name")
    );
  }, []);
  const [correoLoading, setCorreoLoading] = useState("");
  const [correoError, setCorreoError] = useState("");
  
  const ponerMail = useCallback(
    async () => {
      setCorreoLoading(true);
      const idUser = await getCookie("id");
      try {
        const data = await updateCorreo(
          idUser
        );
        if (data == 200) {
          document.cookie =
          "mailverificado=" + await setCookie("true") + "; max-age=28800; path=/";
        setMailVerificadoCambio(true);
          setCorreoLoading(false);
        } else {
        }
      } catch (error) {
        console.error(error);
        
        setCorreoLoading(false);
        correoError("Error al actualizar el correo");

      }
    },
    []
  );
  const removeAlert = (index) => {
    const updatedAlerts = [...alerts];
    updatedAlerts.splice(index, 1);
    setAlerts(updatedAlerts);
};
  const activarPopUpFiltro = useCallback(async () => {

    setPopUpFiltroActivo(!popUpFiltroActivo);
  }, []);

  const getEmpresa = useCallback(async () => {
    return await getCookie("fl_erp_empresas");
  }, []);


  const enviarMailRecuperacion = useCallback(async (dni, nuevaContraseña) => {
    const headers = {
      "content-type": "application/json; charset=utf-8",
    };
    try {
      const data = await mailUsuario(dni);
      if (data.status == 200) {
        const data2 = await cambioPassword(nuevaContraseña, data.datos.ID, 'tgroup');

        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.datos.EMAIL, pass: nuevaContraseña }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to send verification email");
        }
        return true;

      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }, []);


  const aceptarTerminos = useCallback(async () => {
    const id = await getCookie("id");
    try {
      const data = await aceptarTYC(
        id,
        await getCookie("fl_erp_empresas")
      );

      if (data.status == 200) {
        document.cookie = `tyc=${await setCookie("true")}; max-age=28800; path=/`;
        setTycCambio(true);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }, []);




  //tolis
  const changePassword = useCallback(async (credentials) => {
    const fl_erp_empresas = await getCookie("fl_erp_empresas");
    const id = await getCookie("id");

    try {
      const data = await cambioPassword(
        credentials.password,
        id,
        await getCookie("fl_erp_empresas")
      );

      if (data.status == 200) {
        document.cookie = `hasPassword=${await setCookie("true")}; max-age=28800; path=/`;
        setHasPassw(true);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  const addAlert = (message) => {
    const newAlert = message;
    setAlerts([...alerts, newAlert]);
};

  
  function generateSqlFilterParams(parametros, filtro) {
    // Split the parametros string into an array of parameter names
  
    
    // Map each parameter name to a SQL-like filter string
    const filters = parametros.map(param => `${param} LIKE '%${filtro}%'`);
    
    // Join the filter strings with ' OR '
    const sqlFilter = filters.join(' OR ');
    
    return sqlFilter;
    }
    function generateSqlParams(dataActual) {
      // Extract values from the object and return as an array
      return Object.keys(dataActual);
    }
    

  const [recibosSinFirmarLoading, setRecibosSinFirmarLoading] = useState(true);
  const [recibosSinFirmar, setRecibosSinFirmar] = useState("");
  
  const getRecibosSinFirmar = useCallback(
    
    async (empresa) => {
      setRecibosSinFirmarLoading(true);
      const id = await getCookie("id");
      try {
        const data = await getRecibos(
          id,
          empresa,
          false,
          1
        );

        if (data.status == 200) {
          setRecibosSinFirmarLoading(false);
          setRecibosSinFirmar(data.datos);
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );
  const [recibosFirmadosLoading, setRecibosFirmadosLoading] = useState(true);
  const [recibosFirmados, setRecibosFirmados] = useState([]);
  const getRecibosFirmados = useCallback(
    async (empresa) => {
      setRecibosFirmadosLoading(true);
      const id = await getCookie("id");
      let page = recibosFirmados.length + 1; // Use the current length as the page number
      if(recibosFirmados.length == 0)
      {
        page = 1;
      }
      try {
        const data = await getRecibos(id, empresa, true, page);
  
        if (data.status === 200) {
          setRecibosFirmados(prevState => {
            const newState = [...prevState];
            newState[page-1] = data.datos;
            return newState;
          });
          setRecibosFirmadosLoading(false);
        } else {
          setRecibosFirmadosLoading(false);
        }
      } catch (error) {
        console.error(error);
        setRecibosFirmadosLoading(false);
      }
    },
    [recibosFirmados.length]
  );

  function generarHora() {
    return new Date().toLocaleString('en-CA', { 
      timeZone: 'America/Argentina/Buenos_Aires', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
  }).replace(', ', 'T').replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
  }
  const updateReciboFirmado = useCallback(
    
    async (id, estado, disconformidad, empresa) => {
      setRecibosFirmaLoading(true);
      try {
        const data = await updateRecibo(
          id,
          estado,
          disconformidad,
          generarHora()
        );
        await postLogRecibo(empresa, estado, id, await getCookie("id"));

        if (data == 200) {
          setRecibosFirmaLoading(false);
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const postLogRecibo = useCallback(
    //L|Login|D|Descarga recibo|F|Firma ok recibo|X|Firma disconforme recibo
    async (FK_WS_CLIENTES, OPERACION, FK_WS_RECIBOS, FK_WS_USUARIOS) => {
      setLogLoading(true);
      if(FK_WS_USUARIOS=="")
      {
        FK_WS_USUARIOS = await getCookie("id");
      }
      
      try {

        const data = await postLog(
          FK_WS_CLIENTES, OPERACION, FK_WS_RECIBOS, FK_WS_USUARIOS, generarHora()
        );
        if (data == 200) {
          setLogLoading(false);
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const getClases = useCallback(async () => {
    const menu = JSON.parse(await getCookie("menu"));
    setClaseLoading(true); // loading

    try {
      await LbGetClases(
        //call clase con parametros
        await getCookie("fl_erp_empresas")
      )
        .then(function (response) {
          if (response.status == 200) {
            //if exitoso
            const clasesAcum = response.datos.filter((clase) =>
              menu.some(
                (menuItem) => menuItem.FK_ITRIS_CLASSES === clase.CLANAME
              )
            );
            setClasesHabilitadas(clasesAcum);

            setClaseLoading(false);
          } else {
          }
        })
        .catch(function (error) {
        });
    } catch (error) {
    }
  }, []);

  function getCookie2(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return null;
  }
  async function setCookie(name) {
    if (name == null) {
      name = "";
    }
        const response = await fetch("/api/getCookies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cookie: name, method: "encrypt" }),
        });
        const res = await response.json()
        return res.value;
      }

  async function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name && cookie[1] != '') {

        const response = await fetch("/api/getCookies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cookie: cookie[1], method: "decrypt" }),
        });
        const res = await response.json()

        return await  res.value;
      }
      
    }
    return null;
  }

  const fetchPDF = async (id) => {
    setPDFLoading(true);
    const token = await getTokenAPI("tgroup");
    const pdf1 = await traerPDF(token.datos[0].GCS_TOKEN, id)
    setPDF(pdf1);
    setPDFLoading(false);
  };

  const isLoggedIn = useCallback(async () => {
    const isLog = await getCookie("isloggedin");
    if (isLog != null) {
      setLoggedIn(true);
      return true;
    } else {
      setLoggedIn(false);
      return false;
    }
  }, []);

  const itHasPassword = useCallback(async () => {
    const hasP = await getCookie("hasPassword");
    if (hasP == "true") {
      return true;
    } else {
      return false;
    }
  }, []);

  useEffect(() => {
    isLoggedIn();
  }, [loggedIn]);

  return (
    <AppContext.Provider
      value={{
        responseLogin,
        loginUser,
        loggedIn,
        isLoggedIn,
        user,
        tareas,
        getName,
        itHasPassword,
        changePassword,
        logout,
        getUsername,
        getEmpresa,
        getClases,
        clasesHabilitadas,
        updateReciboFirmado,
        registroActual,
        claseLoading,
        registroLoading,
        endpointLoading,
        endpointDataActual,
        popUpSelectorActivo,
        setPopUpSelectorActivo,
        campoSelectorActivo,
        activarPopUpFiltro,
        popUpFiltroActivo,
        setPopUpFiltroActivo,
        datosFormularioActual,
        setDatosFormularioActual,
        postLogRecibo,
        campoPopUpActual,
        paginaActualComponente,
        getCookie,
        setEndpointFiltroActual,
        endpointFiltroActual,
        ponerMail,
        enviarMailRecuperacion,
        correoLoading,
        endpointActualPopUp,
        hasPassw,
        addAlert,
        alerts,
        removeAlert,
        recibosFirmaLoading,
        getEmpresasHab,
        logLoading,
        aceptarTerminos,
        getRecibosSinFirmar,
        recibosSinFirmarLoading,
        recibosSinFirmar,
        getRecibosFirmados,
        recibosFirmadosLoading,
        recibosFirmados,
        fetchPDF,PDF,PDFLoading,
        mailVerificadoCambio,
        tycCambio
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContexts must be used within a AppContextProvider");
  }
  return context;
};

export default AppContext;
