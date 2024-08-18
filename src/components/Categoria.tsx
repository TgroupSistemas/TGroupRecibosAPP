import { Producto } from "../app/Modelo";
import React, { useState, useEffect } from "react";
import PopUpAgregar from "./EmpresaBoton"; // Adjust the import path as necessary
import { api } from "../app/utils";
import ProductoCard from "./ProductoCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
interface CategoriaProps {
  categoria: string;
}
const LISTADO_INICIAL: Producto[] = [];
import { useUpdateTrigger } from "../app/context";
let primeraVez = true;
export default function Categoria(props: CategoriaProps) {
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => setShowPopup(!showPopup);
  const [listado, setListado] = useState<Producto[]>(LISTADO_INICIAL);
  const [listadoLoading, setListadoLoading] = useState<boolean>(true);
  const { triggerUpdate } = useUpdateTrigger();

  useEffect(() => {
    const fetchData = () => {
      setListadoLoading(true);
      api<Producto[]>('/v1/producto')
        .then((data: Producto[]) => {
          setListadoLoading(false);
          setListado(data);
          console.log(data);
          primeraVez = false;
        });
    };
  
    if (!primeraVez) {
      setListadoLoading(true);
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 2000); 
  
      return () => clearTimeout(timeoutId); 
    }
    else{
      fetchData();
    }
  }, [triggerUpdate]);

  return (
    
        <div className="pb-5">
        <h2 className="text-xl">{props.categoria}</h2>
{listadoLoading ? (
  <div className="flex justify-center items-center">
  <span className="loading loading-infinity loading-lg"></span>
  </div>      ) : (

        <><div className="flex flex-wrap lg:grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 p-4 border-t-solid border-t-2">
            {listado?.map((c: Producto) => (
              <ProductoCard key={c.meli_id} producto={c}></ProductoCard>
            ))}
          </div><div className="flex justify-center">
              <button className="btn btn-xl btn-circle border-none hover:bg-green-700 my-4 mx-2 text-xl bg-verde text-white" onClick={togglePopup}>
                <FontAwesomeIcon icon={faAdd} />
              </button>
            </div></>
      )}
            {showPopup && <PopUpAgregar setShowPopupAgregar={setShowPopup} listado={listado} />}
            </div>
    
  );
}
