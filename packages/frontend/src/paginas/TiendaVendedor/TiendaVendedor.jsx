import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductosPorVendedor } from '../../services/productoService';
import { ProductoCard } from '../../componentes/ProductoCard/ProductoCard';
import { ChevronLeftIcon } from '../../componentes/icons';
import { Button } from '../../componentes/Button/Button';
import { Spinner } from 'react-bootstrap';
import { Search, Tag, FileText, ArrowUpDown, DollarSign, XCircle } from 'lucide-react';
import './TiendaVendedor.css';

export const TiendaVendedor = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [vendedorNombre, setVendedorNombre] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [categorias, setCategorias] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(1); // ESTADO NUEVO
  const [totalProducts, setTotalProducts] = useState(0); // ESTADO NUEVO
  const [filtroTrigger, setFiltroTrigger] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      if (!id) return;
      
      const filtros = {
        titulo: titulo,
        categorias: categorias,
        descripcion: descripcion,
        precioMin: precioMin,
        precioMax: precioMax,
        sort: sort,
        page: page,
        limit: limit
      };
      try {
        setIsLoading(true);
        setError(null);
        
        // Obtenemos el objeto completo con { productos, totalPaginas, totalProductos, pagina }
        const response = await getProductosPorVendedor(id, filtros);
        const data = response.productos || [];

        if (data.length > 0) {
          setProductos(data);
          setVendedorNombre(data[0].vendedorId.nombre);
          setTotalPages(response.totalPaginas || 1); // <--- Captura de metadatos
          setTotalProducts(response.totalProductos || 0); // <--- Captura de metadatos
        } else {
          setProductos([]);
          setVendedorNombre('Vendedor');
          setTotalPages(1); 
          setTotalProducts(0); 
        }
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos.");
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, [id, filtroTrigger]);

  const aplicarFiltros = () => {
    // Si la página es diferente a 1, la reseteamos, lo que disparará el useEffect.
    if (page !== 1) {
        setPage(1);
    } else {
        // Si ya estamos en la página 1, forzamos el re-fetch.
        setFiltroTrigger(prev => prev + 1);
    }
  };
  
  // NUEVA FUNCIÓN: Maneja el cambio de página
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setFiltroTrigger(prev => prev + 1); // Forzar el re-fetch
  };

  const resetFiltros = () => {
    setTitulo('');
    setCategorias('');
    setDescripcion('');
    setPrecioMin('');
    setPrecioMax('');
    setSort('');
    setPage(1);
    setLimit(4);
    setFiltroTrigger(prev => prev + 1);
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
          <input type="text" placeholder="Buscar por nombre" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>

        <div className="filtro-item">
          <Tag className="filtro-icon" />
          <input type="text" placeholder="Categoría" value={categorias} onChange={(e) => setCategorias(e.target.value)} />
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
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Ordenar por...</option>
            <option value="precioAsc">Precio: menor a mayor</option>
            <option value="precioDesc">Precio: mayor a menor</option>
            <option value="masVendido">Más vendidos</option>
          </select>
        </div>

        <button className="btn-reset" onClick={resetFiltros}>
          <XCircle size={18} /> Limpiar
        </button>

        <button className="btn-filtrar" onClick={aplicarFiltros} disabled={isLoading}>
          <Search size={18} /> Filtrar
        </button>
      </div>

      {isLoading ? (
        <div className="tienda-spinner">
          <Spinner animation="border" role="status" variant="dark" />
        </div>
      ) : error ? (
        <p className="tienda-error">{error}</p>
      ) : productos.length === 0 ? (
        <p className="tienda-empty">No hay productos que coincidan con los filtros.</p>
      ) : (
        <>
            <div className="producto-grid">
              {productos.map((producto) => (
                <ProductoCard key={producto._id} producto={producto} />
              ))}
            </div>
            
            {/* Controles de Paginación */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <Button 
                        variant="secondary" 
                        onClick={() => handlePageChange(page - 1)} 
                        disabled={page === 1 || isLoading}
                    >
                        Anterior
                    </Button>
                    <span className="pagination-info">
                        Página {page} de {totalPages} ({totalProducts} productos)
                    </span>
                    <Button 
                        variant="secondary" 
                        onClick={() => handlePageChange(page + 1)} 
                        disabled={page === totalPages || isLoading}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </>
      )}
    </div>
  );
};