import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductosPorVendedor } from '../../services/productoService';
import { ProductoCard } from '../../componentes/ProductoCard/ProductoCard';
import { ChevronLeftIcon } from '../../componentes/icons';
import { Spinner } from 'react-bootstrap';
import { Search, Tag, FileText, ArrowUpDown, DollarSign, XCircle } from 'lucide-react';
import './TiendaVendedor.css';

export const TiendaVendedor = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [vendedorNombre, setVendedorNombre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [orden, setOrden] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      if (!id) return;
      
      const filtros = {
        nombre,
        categorias,
        descripcion,
        precioMin,
        precioMax,
        sort,
        page,
        limit
      };
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductosPorVendedor(id, filtros);
        if (data && data.length > 0) {
          setProductos(data);
          setVendedorNombre(data[0].vendedorId.nombre);
        } else {
          setProductos([]);
          setVendedorNombre('Vendedor');
        }
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, [id, nombre, categorias, descripcion, precioMin, precioMax, sort, page, limit]);


  const resetFiltros = () => {
    setNombre('');
    setCategoria('');
    setDescripcion('');
    setPrecioMin('');
    setPrecioMax('');
    setOrden('');
  };

  return (
    <div className="tienda-container">
      <div className="tienda-header">
        <Link to="/" className="tienda-back-link">
          <ChevronLeftIcon className="icon-md" />
          Volver
        </Link>
        <h1 className="tienda-title">Tienda de {vendedorNombre || '...'}</h1>
      </div>

      <div className="filtros-wrapper">
        <div className="filtro-item">
          <Search className="filtro-icon" />
          <input type="text" placeholder="Buscar por nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="filtro-item">
          <Tag className="filtro-icon" />
          <input type="text" placeholder="Categoría" value={categoria} onChange={(e) => setCategorias(e.target.value)} />
        </div>

        <div className="filtro-item">
          <FileText className="filtro-icon" />
          <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>

        <div className="filtro-item">
          <DollarSign className="filtro-icon" />
          <input
            type="number"
            placeholder="Precio mínimo"
            value={precioMin}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '' || /^\d+$/.test(raw)) setPrecioMin(raw.replace(/^0+(?=\d)/, ''));
            }}
          />
        </div>

        <div className="filtro-item">
          <DollarSign className="filtro-icon" />
          <input
            type="number"
            placeholder="Precio máximo"
            value={precioMax}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '' || /^\d+$/.test(raw)) setPrecioMax(raw.replace(/^0+(?=\d)/, ''));
            }}
          />
        </div>

        <div className="filtro-item">
          <ArrowUpDown className="filtro-icon" />
          <select value={orden} onChange={(e) => setSort(e.target.value)}>
            <option value="">Ordenar por...</option>
            <option value="precioAsc">Precio: menor a mayor</option>
            <option value="precioDesc">Precio: mayor a menor</option>
            <option value="masVendido">Más vendidos</option>
          </select>
        </div>

        <button className="btn-reset" onClick={resetFiltros}>
          <XCircle size={18} /> Limpiar
        </button>
      </div>

      {isLoading ? (
        <div className="tienda-spinner">
          <Spinner animation="border" role="status" variant="dark" />
        </div>
      ) : error ? (
        <p className="tienda-error">{error}</p>
      ) : productosFiltrados.length === 0 ? (
        <p className="tienda-empty">No hay productos que coincidan con los filtros.</p>
      ) : (
        <div className="producto-grid">
          {productosFiltrados.map((producto) => (
            <ProductoCard key={producto._id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};
