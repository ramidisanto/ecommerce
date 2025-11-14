import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useCart } from '../../componentes/Context/CartContext';
import { Button } from '../../componentes/Button/Button';
import './Checkout.css';
import { CrearPedido } from '../../services/pedidosService';
import { useNotification } from '../../componentes/Context/NotificationContext';

import { obtenerCoordenadas } from '../../services/geocodingService';

const HARDCODED_USER_ID = '690bbf9ee29dcdbf52c8ecd1';


export const Checkout = () => {
  const {addNotification} = useNotification();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const validate = (values) => {
    const errors = {};
    if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    //if (!values.apellido.trim()) errors.apellido = 'El apellido es obligatorio';
    if (!values.email.trim()) errors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'El email no es válido';
    if (!values.telefono.trim()) errors.telefono = 'El teléfono es obligatorio';
    if (!values.calle.trim()) errors.calle = 'La calle es obligatoria';
    if (!values.numero.trim()) errors.numero = 'El número es obligatorio';
    if (!values.localidad.trim()) errors.localidad = 'La localidad es obligatoria';
    if (!values.provincia.trim()) errors.provincia = 'La provincia es obligatoria';
    if (!values.pais.trim()) errors.pais = 'El país es obligatorio';
    if (!values.codigoPostal.trim()) errors.codigoPostal = 'El código postal es obligatorio';

    return errors;
  };

 
  const onSubmit = async (values) => {
  
    try {
      const coords = await obtenerCoordenadas({
        calle: values.calle,
        numero: values.numero,
        localidad: values.localidad,
        provincia: values.provincia,
        pais: values.pais,
      });

      if (!coords) {
        addNotification("No pudimos obtener la ubicación. Revisá la dirección.", "error");
        return;
      }      
      
      // const usuario = new Usuario(
      //   `${values.nombre} ${values.apellido}`,
      //   values.email,
      //   values.telefono,
      //   TipoUsuario.Cliente,
      //   new Date().toISOString()
      // );

      
      // const pedidoData = {
      //   usuario: {
      //     id : HARDCODED_USER_ID,
      //     nombre: values.nombre,
      //     email: values.email,
      //     telefono: values.telefono,
      //     tipo: HARDOCDE_TIPO,
      //     fechaAlta: HARDCODED_FECHA_ALTA,
      //   },
      //   direccionEntrega: {
      //     calle: values.calle,
      //     numero: values.numero,
      //     piso: values.piso,
      //     depto: values.depto,
      //     codigoPostal: 1832,
      //     localidad: values.localidad,
      //     provincia: values.provincia,
      //     pais: values.pais,
      //     lat: 45,
      //     lon: -73,
      //   },
      //   items: cartItems.map((item) => ({
      //     productoId: item._id || item.id ,
      //     nombre: item.titulo,
      //     cantidad: item.quantity,
      //     precio: item.precio,
      //   })),
      //   moneda: 'ARS',
      //   total: cartTotal,
      //   fecha: new Date().toISOString(),
      // };

    const pedidoData = {
      comprador: HARDCODED_USER_ID, 
      moneda: "ARS",
      direccionEntrega: {
      calle: values.calle,
      altura: Number(values.numero), 
      piso: values.piso ? Number(values.piso) : null,
      departamento: values.depto || null,
      codigoPostal: Number(values.codigoPostal),
      ciudad: values.localidad, 
      provincia: values.provincia,
      pais: values.pais,
      lat: coords.lat,
      lon: coord.lon,
      },
      items: cartItems.map((item) => ({
      productoId: item._id || item.id,
      cantidad: item.quantity,
      precioUnitario: item.precio, 
      })),
      };

      
      const response = await CrearPedido(pedidoData);
      console.log('Pedido creado:', response);

      addNotification( `Pedido creado con éxito por $${cartTotal.toFixed(2)}!`,'success');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      addNotification('Ocurrió un error al crear el pedido. Intenta nuevamente.', 'error');
    }
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    showError,
    isSubmitting,
    isValid,
  } = useForm(
    {
      nombre: '',
      //apellido: '',
      email: '',
      telefono: '',
      calle: '',
      numero: '',
      piso: '',
      depto: '',
      localidad: '',
      provincia: '',
      pais: '',
      codigoPostal: '',
    },
    onSubmit,
    validate
  );

  console.log('VALID?', isValid);
  console.log('CART ITEMS:', cartItems);

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Finalizar Compra</h1>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2 className="checkout-section-title">Datos personales</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu nombre"
            />
            <span className="error">{showError('nombre')}</span>
          </div>

          {/* <div className="form-group">
            <label>Apellido</label>
            <input
              name="apellido"
              value={values.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu apellido"
            />
            <span className="error">{showError('apellido')}</span>
          </div> */}

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="ejemplo@mail.com"
            />
            <span className="error">{showError('email')}</span>
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              name="telefono"
              value={values.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: 1122334455"
            />
            <span className="error">{showError('telefono')}</span>
          </div>
        </div>

        <h2 className="checkout-section-title">Datos de entrega</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Calle</label>
            <input
              name="calle"
              value={values.calle}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Calle"
            />
            <span className="error">{showError('calle')}</span>
          </div>

          <div className="form-group">
            <label>Número</label>
            <input
              name="numero"
              value={values.numero}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Número"
            />
            <span className="error">{showError('numero')}</span>
          </div>

          <div className="form-group">
            <label>Piso</label>
            <input
              name="piso"
              value={values.piso}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Opcional"
            />
          </div>

          <div className="form-group">
            <label>Depto</label>
            <input
              name="depto"
              value={values.depto}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Opcional"
            />
          </div>

          <div className="form-group">
            <label>Localidad</label>
            <input
              name="localidad"
              value={values.localidad}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ciudad o barrio"
            />
            <span className="error">{showError('localidad')}</span>
          </div>

          <div className="form-group">
            <label>Codigo Postal</label>
            <input
              name="codigoPostal"
              value={values.codigoPostal}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: 1832"
            />
            <span className="error">{showError('codigoPostal')}</span>
          </div>

          <div className="form-group">
            <label>Provincia</label>
            <input
              name="provincia"
              value={values.provincia}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Buenos Aires"
            />
            <span className="error">{showError('provincia')}</span>
          </div>

          <div className="form-group">
            <label>País</label>
            <input
              name="pais"
              value={values.pais}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Argentina"
            />
            <span className="error">{showError('pais')}</span>
          </div>
        </div>

        <div className="checkout-total">
          <p>Total a pagar:</p>
          <h2>${cartTotal.toFixed(2)}</h2>
        </div>

        <div className="checkout-buttons">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !isValid || cartItems.length === 0}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Compra'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from '../../hooks/useForm';
// import { useCart } from '../../componentes/Context/CartContext';
// import { Button } from '../../componentes/Button/Button';
// import './Checkout.css';
// import { CrearPedido } from '../../services/pedidosService';

// export const Checkout = () => {
//   const navigate = useNavigate();
//   const { cartItems, cartTotal, clearCart } = useCart();

//   const validate = (values) => {
//     const errors = {};
//     if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
//     if (!values.apellido.trim()) errors.apellido = 'El apellido es obligatorio';
//     if (!values.email.trim()) errors.email = 'El email es obligatorio';
//     else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'El email no es válido';
//     if (!values.telefono.trim()) errors.telefono = 'El teléfono es obligatorio';
//     if (!values.calle.trim()) errors.calle = 'La calle es obligatoria';
//     if (!values.numero.trim()) errors.numero = 'El número es obligatorio';
//     if (!values.localidad.trim()) errors.localidad = 'La localidad es obligatoria';
//     if (!values.provincia.trim()) errors.provincia = 'La provincia es obligatoria';
//     if (!values.pais.trim()) errors.pais = 'El país es obligatorio';
//     return errors;
//   };

//   const onSubmit = (values) => {
//     console.log('Compra confirmada:', values);
//     alert(`¡Compra confirmada por $${cartTotal.toFixed(2)}!`);
//     clearCart();
//     navigate('/');
//   };

//   const {
//     values,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     showError,
//     isSubmitting,
//     isValid,
//   } = useForm(
//     {
//       nombre: '',
//       apellido: '',
//       email: '',
//       telefono: '',
//       calle: '',
//       numero: '',
//       piso: '',
//       depto: '',
//       localidad: '',
//       provincia: '',
//       pais: '',
//     },
//     onSubmit,
//     validate
//   );

//   return (
//     <div className="checkout-container">
//       <h1 className="checkout-title">Finalizar Compra</h1>

//       <form className="checkout-form" onSubmit={handleSubmit}>
//         <h2 className="checkout-section-title">Datos personales</h2>
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Nombre</label>
//             <input
//               name="nombre"
//               value={values.nombre}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Tu nombre"
//             />
//             <span className="error">{showError('nombre')}</span>
//           </div>

//           <div className="form-group">
//             <label>Apellido</label>
//             <input
//               name="apellido"
//               value={values.apellido}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Tu apellido"
//             />
//             <span className="error">{showError('apellido')}</span>
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               name="email"
//               type="email"
//               value={values.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="ejemplo@mail.com"
//             />
//             <span className="error">{showError('email')}</span>
//           </div>

//           <div className="form-group">
//             <label>Teléfono</label>
//             <input
//               name="telefono"
//               value={values.telefono}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Ej: 1122334455"
//             />
//             <span className="error">{showError('telefono')}</span>
//           </div>
//         </div>

//         <h2 className="checkout-section-title">Datos de entrega</h2>
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Calle</label>
//             <input
//               name="calle"
//               value={values.calle}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Calle"
//             />
//             <span className="error">{showError('calle')}</span>
//           </div>

//           <div className="form-group">
//             <label>Número</label>
//             <input
//               name="numero"
//               value={values.numero}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Número"
//             />
//             <span className="error">{showError('numero')}</span>
//           </div>

//           <div className="form-group">
//             <label>Piso</label>
//             <input
//               name="piso"
//               value={values.piso}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Opcional"
//             />
//           </div>

//           <div className="form-group">
//             <label>Depto</label>
//             <input
//               name="depto"
//               value={values.depto}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Opcional"
//             />
//           </div>

//           <div className="form-group">
//             <label>Localidad</label>
//             <input
//               name="localidad"
//               value={values.localidad}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Ciudad o barrio"
//             />
//             <span className="error">{showError('localidad')}</span>
//           </div>

//           <div className="form-group">
//             <label>Provincia</label>
//             <input
//               name="provincia"
//               value={values.provincia}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Ej: Buenos Aires"
//             />
//             <span className="error">{showError('provincia')}</span>
//           </div>

//           <div className="form-group">
//             <label>País</label>
//             <input
//               name="pais"
//               value={values.pais}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Ej: Argentina"
//             />
//             <span className="error">{showError('pais')}</span>
//           </div>
//         </div>

        
//         <div className="checkout-total">
//           <p>Total a pagar:</p>
//           <h2>${cartTotal.toFixed(2)}</h2>
//         </div>

//         <div className="checkout-buttons">
//           <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
//             Cancelar
//           </Button>

//           <Button
//             type="submit"
//             variant="primary"
//             disabled={isSubmitting || !isValid || cartItems.length === 0}
//           >
//             {isSubmitting ? 'Procesando...' : 'Confirmar Compra'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Checkout;
