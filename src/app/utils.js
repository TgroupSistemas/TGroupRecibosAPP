
// utils.ts

export async function api<T>(url: string): Promise<T> {
    const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API}${url}`;
    console.log(urlCompleta)
    const response = await fetch(urlCompleta);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await (response.json() as Promise<T>);
}

export interface ProductoParams { meli_id: string };
export interface ProductoRespuesta { mensaje: string }

export async function agregarProducto(params: ProductoParams): Promise<ProductoRespuesta> {
    const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API}/v1/producto`;

    const response = await fetch(urlCompleta, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        var body = await response.text();
        return { mensaje: `Error agregando producto: ${body}` };
    }
    else {
        console.log(response)
        return { mensaje: `agregada con exito!` };
    }
}

export async function eliminarProducto(params: ProductoParams): Promise<ProductoRespuesta> {
    const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API}/v1/producto`;

    const response = await fetch(urlCompleta, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        var body = await response.text();
        return { mensaje: `Error eliminando producto: ${body}` };
    }
    else {
        return { mensaje: `Producto eliminado con exito!` };
    }
}
export interface Credentials { mensaje: string }


export async function loginUser(credentials: credentials): Promise<boolean> => {
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
          "fl_erp_empresas=" +
          data.datos.FK_WS_CLIENTES +
          "; max-age=3600; path=/";
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