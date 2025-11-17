import React, { useState, useEffect } from 'react';
import Link from 'next/link';


interface agregarProps {
    empresa: string;
    destino: string;
}
export default function EmpresaBoton(props: agregarProps) {


    return (
        <Link className="w-full md:w-1/3" href={"/" + props.destino}>
        <div className="p-4">
          <div className="flex rounded-lg h-full w-full bg-slate-200 p-8 flex-col">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 className="text-gray-900 text-lg title-font font-medium">{props.empresa}</h2>
            </div>
            <div className="flex-grow">
              <p className="leading-relaxed text-base">
              </p>
              <button className="mt-3 text-indigo-500 inline-flex items-center">
                Entrar
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
}