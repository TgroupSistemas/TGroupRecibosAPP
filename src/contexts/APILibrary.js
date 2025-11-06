import bcrypt from "bcrypt-nodejs";
import dotenv from "dotenv";
import axios from "axios";
import { tr } from "date-fns/locale";

dotenv.config();

const PDF_URL = "https://storage.googleapis.com/storage/v1/b/";
const PDF_URL_UPLOAD = "https://storage.googleapis.com/upload/storage/v1/b/";
const URL = "https://webapp.tgroup.com.ar/webapp";
const KEY = "$2a$10$d9IbX8BaND9kDRoI9JKCZu";
const AUTH = `Bearer Mg.og_Wy4tHM9unKseHLu4F0wz4dDcwMsrZc49XXSOFpFDSO-nu7vbB5tYEBA9o`;

const config = {
  headers: { Authorization: `${AUTH}` },
};

const sendError = async (error) => {
  await fetch("/api/sendError", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error }),
  });
};

export async function logeo(credentials) {
  
  const username = credentials.dni;
  const password = credentials.password;


  try {
    let passwordIntocada = password;
    let salt = KEY;
    let respuestaAPI;

    let pass = await new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, null, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

      if (username) {
        let sqlFilter = `USERNAME = '${username}'`;

        const resp = await axios.get(
          `${URL}/clases/WS_USUARIOS?sqlFilter=${sqlFilter}`,
          config
        );
        let datos = resp.data;
        if (!resp || resp.status !== 200) {
          respuestaAPI = 502;
          await sendError(
            `Error de login servidor caido: ${username} - ${passwordIntocada}`
          );
        } else if (datos.length == 0) {
          respuestaAPI = 201;
          await sendError(
            `Error de login no se encontro el usuario: Usuario: ${username} - PasswordReal ${passwordIntocada} - PasswordEncriptada ${pass}`
          );
        } else {
          respuestaAPI = 200;
          if (datos[0].PASSWORD === "" || datos[0].PASSWORD === null) {
            if (password.includes("*12*45")) {
              const part1 = password.replace("*12*45", "");

              let sqlFilter2 = `ID='${part1}'`;

              const resp2 = await axios.get(
                `${URL}/clases/WS_CLIENTES?sqlFilter=${sqlFilter2}&&cliente=${datos[0].FK_WS_CLIENTES}`,
                config
              );


              let datos2 = resp2.data;

              if (datos2.length == 0) {
                respuestaAPI = 201;
                await sendError(
                  `Error de login: Usuario: ${username} - PasswordReal ${passwordIntocada} - PasswordEncriptada ${pass}`
                );
              }
            } else if (password === "cronisueldos" || password === "TgroupDEMO" || password === "Itbrokers") {
              await sendError(
                `Logeo exitoso de Usuario: ${username} con contraseña universal ${passwordIntocada} `
              );
            } else {
              respuestaAPI = 401;
              await sendError(
                `Error de login: ${username}  ${passwordIntocada}`
              );
            }
          } else {
            if (datos[0].PASSWORD == pass) {
              // Redirect to home page
            } else {
              respuestaAPI = 401;
              await sendError(
                `Contraseña incorrecta de Usuario: ${username} de con contraseña  ${passwordIntocada} `
              );
            }
          }
        }
        if (respuestaAPI === 200) {
          return { status: respuestaAPI, datos: datos[0] };
        }
      }
    
    return { status: respuestaAPI, datos: null };
  } catch (error) {
    console.error(error);
    sendError(
      `Error de login: ${username}  - ${passwordIntocada} - ${error}`
    );
  }
}

export async function enviarClase(endpoint, empresa, datosFormularioActual) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${AUTH}`,
      },
    };
    const axiosResponse = await axios.post(
      `${URL}${endpoint}?cliente=${empresa}`,
      JSON.stringify(datosFormularioActual),
      config
    );
    return { status: 200, datos: axiosResponse.data };
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}

export async function postLicencia(datosFormularioActual) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${AUTH}`,
      },
    };
    const axiosResponse = await axios.post(
      `${URL}/clases/Ws_NOTIFICACIONES?cliente=${datosFormularioActual.FK_WS_CLIENTES}`,
      JSON.stringify(datosFormularioActual),
      config
    );
    return { status: 200, datos: axiosResponse.data };
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}

export async function mailUsuario(dni) {
  let sqlFilter = `USERNAME = '${dni}'`;
  let respuestaAPI;
  const empresas = ["TGROUP", "CRONI", "ITBROKERS"];
  for (const empresa of empresas) {
    try {
      const resp = await axios.get(
        `${URL}/clases/WS_USUARIOS?sqlFilter=${sqlFilter} &cliente=${empresa}&sqlAttributes=EMAIL,ID`,
        config
      );
      let datos = resp.data;
      if (datos.length > 0) {
        respuestaAPI = 200;
        return { status: respuestaAPI, datos: datos[0], empresa }; 
      }
    } catch (error) {
      console.error(error);
    }
  }
  return { status: 201 };
}

export async function datosUsuario(dni, empresa) {
  let sqlFilter = `USERNAME = '${dni}'`;
  let respuestaAPI;
  try {
    const resp = await axios.get(
      `${URL}/clases/WS_USUARIOS?sqlFilter=${sqlFilter} &cliente=${empresa}&sqlAttributes=CALLE,CELULARES,CP,CUIL,DEPTO,EMAIL,FULLNAME,LOCALIDAD,NUMERO,PARTIDO,PISO,PROVINCIA,TE,CALZADO,REMERA,PANTALON, ENTRE_CALLES`,
      config
    );
    let datos = resp.data;
    if (datos.length == 0) {
      respuestaAPI = 201;
    } else {
      respuestaAPI = 200;

      return { status: respuestaAPI, datos: datos[0] };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function cambioPassword(password, id, rs) {
  if (id && rs && password) {
    try {
      const salt = KEY;
      let pass = await new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) reject(err);
          resolve(hash);
        });
      });
      const resp = await axios.put(
        `${URL}/usuarios?cliente=${rs}`,
        {
          id: id,
          password: pass,
        },
        config
      );
      return { status: 200, datos: resp.data };
    } catch (error) {
      console.error(error);
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  } else {
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}

export async function aceptarTYC(id, rs) {
  if (id && rs) {
    try {
      const resp = await axios.put(
        `${URL}/clases/WS_USUARIOS/${id}?cliente=${rs}`,
        {
          ACEPTA_TYC: true,
        },
        config
      );
      return { status: 200, datos: resp.data };
    } catch (error) {
      console.error(error);
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  } else {
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}
export async function aceptarVDP(id, rs, ver, desc, hora) {
  if (id && rs) {
    try {
      const resp = await axios.put(
        `${URL}/clases/WS_USUARIOS/${id}?cliente=${rs}`,
        {
          ACEPTA_DP: ver,
        },
        config
      );
      if (ver == "X") {
        const resp2 = await axios.post(
          `${URL}/clases/WS_NOTIFICACIONES/?cliente=${rs}`,
          {
            FK_WS_USUARIOS: id,
            OPERACION: "D",
            NOTAS: desc,
            FECHA_HORA: hora,
          },
          config
        );
      }

      return { status: 200, datos: resp.data };
    } catch (error) {
      console.error(error);
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  } else {
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}

export async function traerEndpoint(
  filtro,
  parametros,
  pagina,
  empresa,
  endpoint
) {
  const sqlFilter =
    filtro && parametros
      ? `&&sqlFilter=${encodeURIComponent(
          generateSqlFilter(parametros, filtro)
        )}`
      : "";
  const resp = await axios.get(
    `${URL}/clases/${endpoint}?cliente=${empresa}${sqlFilter}${
      pagina ? `&page=${pagina}` : ""
    }`,
    config
  );
  return { status: 200, datos: resp.data };
}

export async function traerNotificaciones(FK_WS_USUARIOS, pagina, empresa) {
  //https://webapp.tgroup.com.ar/webapp/clases/Ws_NOTIFICACIONES?cliente=TGROUP&sqlFilter=FK_WS_USUARIOS = '3076d266-6b7c-41d6-b3cf-24b1f224c9aa' AND OPERACION = 'E'
  const resp = await axios.get(
    `${URL}/clases/Ws_NOTIFICACIONES?cliente=${empresa}&&sqlFilter=FK_WS_USUARIOS = '${FK_WS_USUARIOS}' AND OPERACION = 'E'${
      pagina ? `&page=${pagina}` : ""
    }`,
    config
  );
  return { status: 200, datos: resp.data };
}

export async function traerNotificacionesNoLeidas(FK_WS_USUARIOS, pagina, empresa) {
  //https://webapp.tgroup.com.ar/webapp/clases/Ws_NOTIFICACIONES?cliente=TGROUP&sqlFilter=FK_WS_USUARIOS = '3076d266-6b7c-41d6-b3cf-24b1f224c9aa' AND OPERACION = 'E'
  const respPage1 = await axios.get(
    `${URL}/clases/Ws_NOTIFICACIONES?cliente=${empresa}&&sqlFilter=FK_WS_USUARIOS = '${FK_WS_USUARIOS}' AND OPERACION = 'E'${
      pagina ? `&page=1` : ""
    }`,
    config
  );

  const respPage2 = await axios.get(
    `${URL}/clases/Ws_NOTIFICACIONES?cliente=${empresa}&&sqlFilter=FK_WS_USUARIOS = '${FK_WS_USUARIOS}' AND OPERACION = 'E'${
      pagina ? `&page=2` : ""
    }`,
    config
  );

  const combinedData = [...respPage1.data, ...respPage2.data];
  const countEstadoL = combinedData.filter((item) => item.ESTADO !== 'L').length;

  return { status: 200, total: countEstadoL };
}

export async function traerLicencias(FK_WS_USUARIOS, pagina, empresa) {
    //https://webapp.tgroup.com.ar/webapp/clases/Ws_NOTIFICACIONES?cliente=TGROUP&sqlFilter=FK_WS_USUARIOS = '3076d266-6b7c-41d6-b3cf-24b1f224c9aa' AND OPERACION = 'E'
    const resp = await axios.get(
      `${URL}/clases/Ws_NOTIFICACIONES?cliente=${empresa}&&sqlFilter=FK_WS_USUARIOS = '${FK_WS_USUARIOS}' AND (OPERACION = 'L' OR OPERACION = 'A')${
      pagina ? `&page=${pagina}&sqlOrderBy=FEC_HAS DESC` : ""
      }`,
      config
    );
    return { status: 200, datos: resp.data };
  }

function generateSqlFilter2(da) {
  const data = JSON.parse(da);

  // Check if the array is valid and not empty
  if (!data || data.length === 0) {
    return "";
  }

  // Extract FK_WS_CLIENTES values
  const fkWsClientesValues = data
    .map((empresa) => empresa.FK_WS_CLIENTES)
    .filter((value) => value);

  // Construct the filter string
  const filterString = fkWsClientesValues
    .map((value) => `CODIGO LIKE '%${value}%'`)
    .join(" OR ");

  return filterString;
}

export async function traerEmpresas(filtro, empresa) {
  const sqlFilter = filtro
    ? `&sqlFilter=${encodeURIComponent(generateSqlFilter2(filtro))}`
    : "";
  const resp = await axios.get(
    `${URL}/clases/WS_EMPRESAS_TGR?cliente=tgroup${sqlFilter}`,
    config
  );
  return { status: 200, datos: resp.data };
}

export async function getRegistroUnico(id, endpoint, empresa) {
  if (id && endpoint) {
    try {
      const resp = await axios.get(
        `${URL}${endpoint}?sqlFilter=FK_CNM_VISITAS=${id}&cliente=${empresa}`,
        config
      );
      return { status: 200, datos: resp.data };
    } catch (error) {
      console.error(error);
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  } else {
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}
export async function getTokenAPI(empresa) {
  if (empresa) {
    try {
      const resp = await axios.get(
        `${URL}/clases/WS_PARAMETROS?cliente=${encodeURIComponent(empresa)}`,
        config
      );
      return { status: 200, datos: resp.data };
    } catch (error) {
      console.error(error);
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  } else {
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}

export async function uploadFile(token, file, empresa) {
  try {
    const response = await fetch(`${PDF_URL_UPLOAD}tgroup_recibos/o?name=${empresa.toUpperCase()}_FILES/${file.name}&uploadType=media`, {
      method: "POST",
      body: file,
      headers: {
        "Content-Type": file.type, // Tipo de archivo correcto
        Authorization: `Bearer ${token}`, // Reemplaza con un token válido si es necesario
      },
    });
    if (!response.ok) {
      throw new Error(`Error al subir el archivo: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error en la subida:", error);
  }
}
export async function traerPDF(token, id) {
  try {

    const response = await fetch(
      `${PDF_URL}tgroup_recibos/o/${id.replace(/\//g, "%2F")}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching PDF:", error);
  }
}

export async function getRecibos(id, empresa, firmados, page) {
  const sqlFilter =
    `FK_WS_USUARIOS='${encodeURIComponent(id)}'` +
    (firmados
      ? " AND (ESTADO_FIRMA = 'X' OR ESTADO_FIRMA = 'F')"
      : " AND (ESTADO_FIRMA != 'X' AND ESTADO_FIRMA != 'F')");
  if (id && empresa) {
    try {
      const resp = await axios.get(
        `${URL}/clases/WS_RECIBOS?sqlFilter=${sqlFilter}&cliente=${encodeURIComponent(
          empresa
        )}&sqlOrderBy=PERIODO ASC&page=${page}`,
        config
      );

      return { status: 200, datos: resp.data };
    } catch (error) {
      console.error(error);
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  } else {
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}

export async function LbGetClases(empresa) {
  if (empresa) {
    try {
      const resp = await axios.get(`${URL}/clases/WS_CLASES`, config);
      return { status: 200, datos: resp.data };
    } catch (error) {
      console.error(error);
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  } else {
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
}

export async function LbRegistroClase(pagina, parametros, endpoint, empresa) {
  if (pagina) {
    try {
      const parametross = new URLSearchParams(parametros);
      let sqlString = "";
      for (let [key, value] of parametross) {
        // Include single quotes around the value and use % as wildcards
        sqlString += `${key} LIKE '%${value}%' AND `;
      }
      sqlString = sqlString.slice(0, -5); // remove the last ' AND '
      // URL encode the entire SQL filter string to ensure special characters are correctly interpreted
      const encodedSqlString = encodeURIComponent(sqlString);

      const resp = await axios.get(
        `${URL}${endpoint}?page=${pagina}&cliente=${empresa}&sqlFilter=${encodedSqlString}`,
        config
      );
      return { status: 200, datos: resp.data };
    } catch (error) {
      console.error(error);
      return {
        status: error.response ? error.response.status : 500,
        message: error.response ? error.response.data : error.message,
      };
    }
  } else {
    return {
      status: 500,
      message: "Page parameter is missing.",
    };
  }
}

function generateSqlFilter(parametros, filtro) {
  // Split the parametros string into an array of parameter names

  // Map each parameter name to a SQL-like filter string
  const filters = parametros.map((param) => `${param} LIKE '%${filtro}%'`);

  // Join the filter strings with ' OR '
  const sqlFilter = filters.join(" OR ");

  return sqlFilter;
}

export const updateRecibo = async (
  id,
  estadoFirma,
  disconformidad,
  FECHA_ESTADO_FIRMA
) => {
  const url = `${URL}/clases/WS_RECIBOS/${id}`;
  const data = {
    FECHA_ESTADO_FIRMA,
    ESTADO_FIRMA: estadoFirma,
  };
  if (disconformidad !== "") {
    data.MOTIVO_DISCONFORMIDAD = disconformidad;
  }
  try {
    const response = await axios.put(url, data, config);
    return response.status;
  } catch (error) {
    console.error(error);
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
};

export const updateReciboComentario = async (id, disconformidad) => {
  const url = `${URL}/clases/WS_RECIBOS/${id}`;
  const data = {
    MOTIVO_DISCONFORMIDAD: disconformidad,
  };

  try {
    const response = await axios.put(url, data, config);
    return response.status;
  } catch (error) {
    console.error(error);
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
};

export const updateNoti = async (id, estado) => {
  const url = `${URL}/clases/Ws_NOTIFICACIONES/${id}`;
  const data = {
    ESTADO: estado,
  };

  try {
    const response = await axios.put(url, data, config);
    return response.status;
  } catch (error) {
    console.error(error);
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
};

export const updateCorreo = async (id, empresa) => {
  const url = `${URL}/clases/WS_USUARIOS/${id}?cliente=${empresa}`;
  const data = {
    EMAIL_VERIFICADO: true,
  };

  try {
    const response = await axios.put(url, data, config);
    return response.status;
  } catch (error) {
    console.error(error);
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
};

async function getIP() {
  try {
    const response = await fetch("/api/getIP");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
}

export const postLog = async (
  FK_WS_CLIENTES,
  OPERACION,
  FK_WS_RECIBOS,
  FK_WS_USUARIOS,
  FECHA_HORA
) => {
  const url = `${URL}/clases/WS_RECIBOS_LOG?cliente=${FK_WS_CLIENTES}`;
  const IP = await getIP();
  const data = {
    FK_WS_CLIENTES,
    IP,
    OPERACION,
    FK_WS_RECIBOS,
    FECHA_HORA,
    FK_WS_USUARIOS,
  };

  try {
    const response = await axios.post(url, data, config);
    return response.status;
  } catch (error) {
    console.error(error);
    return {
      status: error.response ? error.response.status : 500,
      message: error.response ? error.response.data : error.message,
    };
  }
};
