import React, { useState } from 'react';
import './BarraBuscador.css';
import { FaSearch, FaShoppingBag } from 'react-icons/fa';
import { TextField } from '@mui/material';

const BarraBuscador = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <div className="barra-buscador">
      <div className="campo-producto">
        <div className="campo-input">
          <FaShoppingBag className="icono-producto" />
          <TextField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="¿Qué producto buscas?"
            variant="standard"
            fullWidth
          />
        </div>
      </div>

      <button className="boton-buscar">
        <FaSearch className="icono-buscar" />
        Buscar
      </button>
    </div>
  );
};

export default BarraBuscador;
