import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import PopupEliminar from '../components/PopUpEliminar'; 

import { Producto } from "../app/Modelo";

export interface ProductoProps {
    producto: Producto;
}


export default function ProductoCard(props: ProductoProps) {
  const [showPopup, setShowPopup] = useState(false);
const togglePopup = () => setShowPopup(!showPopup);
  return (
    <>
      <div className="bg-white shadow-xl w-full rounded-md px-2">
        
        <div className="flex justify-between">
          
          <h3 className="font-bold text-black text-2xl m-4 mb-1">{props.producto.nombre}</h3>
          <button className="btn btn-xs btn-circle border-none hover:bg-red-700 my-4 mx-2 bg-rojo text-white" onClick={togglePopup}><FontAwesomeIcon icon={faTrash} /></button>

        </div>
        <h4 className=" text-grey text-lg m-4 mt-2">${props.producto.precio.toFixed(2)} </h4>

        <p className="mb-10 text-5xl center text-center">
        </p>
      </div>
       {showPopup && <PopupEliminar meli_id={props.producto.meli_id} setShowPopupEliminar={setShowPopup} nombre={props.producto.nombre} />}    </>
  );
}
