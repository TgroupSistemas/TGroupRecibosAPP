import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import {
  logeo,
  enviarClase,
  cambioPassword,
  traerEndpoint,
  getRegistroUnico,
  LbGetClases,
  LbRegistroClase,
  getRecibos
} from "./APILibrary";
import bcrypt from "bcrypt-nodejs";
import dotenv from "dotenv";
dotenv.config();

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState("Usuario");
  const [tareas, setTareas] = useState({});
  const [responseLogin, setResponseLogin] = useState({});
  const [loggedIn, setLoggedIn] = useState(true);
  const [clasesHabilitadas, setClasesHabilitadas] = useState([]);
  const [claseLoading, setClaseLoading] = useState(false);
  const [tareasLoading, setTareasLoading] = useState(true);
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
        setLoggedIn(true);
        setResponseLogin(data);
        document.cookie = "isloggedin=" + true + "; max-age=3600; path=/";
        document.cookie = `id=${data.datos.ID}; max-age=3600; path=/`;
        document.cookie = `hasPassword=${
          data.datos.PASSWORD != "" && data.datos.PASSWORD != null? true : false
        }; max-age=3600; path=/`;
        document.cookie =
          "rs_elecom=" + data.datos.ELECOM_RS + "; max-age=3600; path=/";
          document.cookie =
          "name=" + data.datos.FULLNAME + "; max-age=3600; path=/";
        document.cookie =
          "fl_erp_empresas=" +
          data.datos.FK_WS_CLIENTES +
          "; max-age=3600; path=/";
        document.cookie =
          "empresas" +
          JSON.stringify(data.datos.WS_DET_CLI_EMPRESAS) +
          "; max-age= ; path=/";
        document.cookie =
          "elecom_vendedor=" +
          data.datos.ELECOM_VENDEDOR +
          "; max-age=3600; path=/";
        document.cookie =
          "username=" + data.datos.USERNAME + "; max-age=3600; path=/";
        document.cookie =
          "fk_erp_contactos=" +
          data.datos.FK_ERP_CONTACTOS +
          "; max-age=3600; path=/";
        document.cookie =
          "menu=" +
          JSON.stringify(data.datos.WS_DET_CLI_MENU) +
          "; max-age=3600; path=/";
        return true;

      } else {
        return false;
      }
    } catch (error) {
      console.log("ERRORRR user mal", error);
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
    setHasPassw(false);

    window.location.replace("/login");
  }, []);
  function formatNumberWithDots(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const getUsername = useCallback(async () => {
    if (getCookie("username") == null) {
      return "TGROUP";
    }
    return (
      formatNumberWithDots(getCookie("username"))
    );
  }, []);
  const getEmpresaName = useCallback(async () => {
    if (getCookie("fl_erp_empresas") == null) {
      return "TGROUP";
    }
    return (
      getCookie("fl_erp_empresas").charAt(0).toUpperCase() +
      getCookie("fl_erp_empresas").slice(1).toLowerCase()
    );
  }, []);
  const getName = useCallback(async () => {
    if (getCookie("name") == null) {
      return "TGROUP";
    }
    return (
      getCookie("name")
    );
  }, []);

  const activarPopUp = useCallback(async (endpoint, pagina, campo) => {
    if (endpoint && pagina) {
      setPaginaActualComponente(pagina);
      setCampoPopUpActual(campo);
      await getEndpoint(endpoint, pagina, "");
      setPopUpSelectorActivo(true);
      setCampoSelectorActivo(campo);
    }
  }, []);

  const siguientePaginaPopUp = useCallback(
    async (endpoint, pagina, filtro, data) => {
      if (endpoint) {
        setPaginaActualComponente(pagina + 1);
        await getEndpoint(endpoint, pagina + 1, filtro, data);
      }
    },
    []
  );

  const anteriorPaginaPopUp = useCallback(
    async (endpoint, pagina, filtro, data) => {
      if (endpoint) {
        setPaginaActualComponente(pagina > 1 ? pagina - 1 : 1);
        await getEndpoint(endpoint, pagina > 1 ? pagina - 1 : 1, filtro, data);
      }
    },
    []
  );
  //tolis
  async function enviarFormularioClase(endpoint) {
    try {
      const data = await enviarClase(
        endpoint,
        getCookie("fl_erp_empresas"),
        datosFormularioActual
      );

      if (data.status == 200) {
        window.location.reload();
      } else {
        console.log("ERRORRR enviarClase");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const removeAlert = (index) => {
    const updatedAlerts = [...alerts];
    updatedAlerts.splice(index, 1);
    setAlerts(updatedAlerts);
};
  const activarPopUpFiltro = useCallback(async () => {

    setPopUpFiltroActivo(!popUpFiltroActivo);
  }, []);

  const getEmpresa = useCallback(async () => {
    return getCookie("fl_erp_empresas");
  }, []);

  //tolis
  const changePassword = useCallback(async (credentials) => {
    const fl_erp_empresas = getCookie("fl_erp_empresas");
    const id = getCookie("id");

    try {
      const data = await cambioPassword(
        credentials.password,
        id,
        getCookie("fl_erp_empresas")
      );

      if (data.status == 200) {
        document.cookie = `hasPassword=${true}; max-age=3600; path=/`;
        setHasPassw(true);
      } else {
        console.log("ERRORRR cambio password");
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  const addAlert = (message) => {
    const newAlert = message;
    setAlerts([...alerts, newAlert]);
};

  const getRegistroClase = useCallback(async (pagina, parametros, endpoint) => {
      setTareasLoading(true);
      try {
        const data = await LbRegistroClase(
          pagina, parametros, endpoint, getCookie("fl_erp_empresas")
        );

        if (data.status == 200) {
          setTareas(data.datos);
          setTareasLoading(false);

        } else {
          console.log("ERRORRR getregistros");
        }
      } catch (error) {
        console.log("ERRORRR getregistros");
        setTareasLoading(false);
      }
    },
    []
  );
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
    
  //tolis
  const getEndpoint = useCallback(
    async (endpoint, pagina, filtro = "", dataActual = "") => {
      const fl_erp_empresas = getCookie("fl_erp_empresas");
      console.log(generateSqlParams(dataActual));
      try {
        const data = await traerEndpoint(
          filtro,
          generateSqlParams(dataActual),
          pagina,
          getCookie("fl_erp_empresas"),
          endpoint
        );

        if (data.status == 200) {
          setEndpointLoading(false);
          setEndpointActualPopUp(endpoint);
          setFiltroEndpointActualFijoPopUp(filtro);
          setEndpointDataActual(data.datos);
        } else {
          console.log("ERRORRR getEndpoint");
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );
  6;
  const [recibosLoading, setRecibosLoading] = useState(true);
  const [recibos, setRecibos] = useState("");
  
  const getRecibosS = useCallback(
    
    async (empresa) => {
      setRecibosLoading(true);
      const id = getCookie("id");
      console.log(id,empresa);
      try {
        const data = await getRecibos(
          id,
          empresa
        );

        if (data.status == 200) {
          setRecibosLoading(false);
          setRecibos(data.datos);
        } else {
          console.log("ERRORRR getEndpoint");
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );



  const getClases = useCallback(async () => {
    const menu = JSON.parse(getCookie("menu"));
    setClaseLoading(true); // loading

    try {
      await LbGetClases(
        //call clase con parametros
        getCookie("fl_erp_empresas")
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
            console.log("ERRORRR getRegistroUnico");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log("ERRORRR getRegistroUnico");
    }
  }, []);

  //tolis
  const getClaseRegistro = useCallback(async (id, endpoint) => {
    setRegistroLoading(true);
    const headers = {
      "content-type": "application/json; charset=utf-8",
    };
    try {
      const data = await getRegistroUnico(
        id,
        endpoint,
        getCookie("fl_erp_empresas")
      )
        .then(function (response) {
          console.log("response", response.datos[0]);
          if (response.status == 200) {
            setRegistroActual(response.datos[0]);
            setRegistroLoading(false);
          } else {
            console.log("ERRORRR getRegistroUnico");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log("ERRORRR getRegistroUnico");
    }
  }, []);

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return null;
  }

  const isLoggedIn = useCallback(async () => {
    const isLog = getCookie("isloggedin");
    if (isLog != null) {
      setLoggedIn(true);
      return true;
    } else {
      setLoggedIn(false);
      return false;
    }
  }, []);

  const itHasPassword = useCallback(async () => {
    const hasP = getCookie("hasPassword");
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
        getRegistroClase,
        itHasPassword,
        changePassword,
        logout,
        getUsername,
        getEmpresa,
        getClases,
        clasesHabilitadas,
        tareasLoading,
        registroActual,
        getClaseRegistro,
        claseLoading,
        registroLoading,
        getEndpoint,
        endpointLoading,
        endpointDataActual,
        popUpSelectorActivo,
        activarPopUp,
        setPopUpSelectorActivo,
        campoSelectorActivo,
        activarPopUpFiltro,
        popUpFiltroActivo,
        setPopUpFiltroActivo,
        datosFormularioActual,
        setDatosFormularioActual,
        campoPopUpActual,
        enviarFormularioClase,
        paginaActualComponente,
        getCookie,
        setEndpointFiltroActual,
        endpointFiltroActual,
        endpointActualPopUp,
        siguientePaginaPopUp,
        anteriorPaginaPopUp,
        hasPassw,
        addAlert,
        alerts,
        removeAlert,
        getRecibosS,
        recibosLoading,
        recibos,
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
