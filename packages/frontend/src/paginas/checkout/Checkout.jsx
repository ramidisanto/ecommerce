import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { useCart } from '../../componentes/Context/CartContext';
import { Button } from '../../componentes/Button/Button';
import './Checkout.css';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  // --- Validación del formulario ---
  const validate = (values) => {
    const errors = {};
    if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    if (!values.apellido.trim()) errors.apellido = 'El apellido es obligatorio';
    if (!values.email.trim()) errors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'El email no es válido';
    if (!values.telefono.trim()) errors.telefono = 'El teléfono es obligatorio';
    if (!values.calle.trim()) errors.calle = 'La calle es obligatoria';
    if (!values.numero.trim()) errors.numero = 'El número es obligatorio';
    if (!values.localidad.trim()) errors.localidad = 'La localidad es obligatoria';
    if (!values.provincia.trim()) errors.provincia = 'La provincia es obligatoria';
    if (!values.pais.trim()) errors.pais = 'El país es obligatorio';
    return errors;
  };

  // --- Acción al confirmar ---
  const onSubmit = (values) => {
    console.log('Compra confirmada:', values);
    alert(`¡Compra confirmada por $${cartTotal.toFixed(2)}!`);
    clearCart();
    navigate('/');
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
      apellido: '',
      email: '',
      telefono: '',
      calle: '',
      numero: '',
      piso: '',
      depto: '',
      localidad: '',
      provincia: '',
      pais: '',
    },
    onSubmit,
    validate
  );

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Finalizar Compra</h1>

      <form className="checkout-form" onSubmit={handleSubmit}>
        {/* DATOS PERSONALES */}
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

          <div className="form-group">
            <label>Apellido</label>
            <input
              name="apellido"
              value={values.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu apellido"
            />
            <span className="error">{showError('apellido')}</span>
          </div>

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

        {/* DATOS DE ENTREGA */}
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

        {/* TOTAL Y BOTONES */}
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

// export const Checkout = () => {
//   const navigate = useNavigate();
//   const { cartItems, cartTotal, clearCart } = useCart();

//   // --- Validación del formulario ---
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

//   // --- Acción al confirmar ---
//   const onSubmit = (values) => {
//     console.log('Compra confirmada:', values);
//     alert(`¡Compra confirmada por $${cartTotal.toFixed(2)}!`);
//     clearCart();
//     navigate('/');
//   };

//   const { values, handleChange, handleBlur, handleSubmit, showError, isSubmitting, isValid } = useForm(
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
//         {/* DATOS PERSONALES */}
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

//         {/* DATOS DE ENTREGA */}
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

//         {/* TOTAL Y BOTONES */}
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



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from '../../hooks/useForm';
// import { useCart } from '../../componentes/Context/CartContext';
// import Button from '../../componentes/Button/Button';
// import './Checkout.css';

// export const Checkout = () => {
//   const navigate = useNavigate();
//   const { cartItems, cartTotal, clearCart } = useCart();

//   // --- Validación del formulario ---
//   const validate = (values) => {
//     const errors = {};
//     if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
//     if (!values.apellido.trim()) errors.apellido = 'El apellido es obligatorio';
//     if (!values.email.trim()) errors.email = 'El email es obligatorio';
//     else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'El email no es válido';
//     if (!values.telefono.trim()) errors.telefono = 'El teléfono es obligatorio';
//     if (!values.direccion.trim()) errors.direccion = 'La dirección es obligatoria';
//     if (!values.localidad.trim()) errors.localidad = 'La localidad es obligatoria';
//     return errors;
//   };

//   // --- Acción al confirmar ---
//   const onSubmit = (values) => {
//     console.log('Compra confirmada:', values);
//     alert(`¡Compra confirmada por $${cartTotal.toFixed(2)}!`);
//     clearCart();
//     navigate('/');
//   };

//   const { values, handleChange, handleBlur, handleSubmit, showError, isSubmitting, isValid } = useForm(
//     {
//       nombre: '',
//       apellido: '',
//       email: '',
//       telefono: '',
//       direccion: '',
//       localidad: '',
//     },
//     onSubmit,
//     validate
//   );

//   return (
//     <div className="checkout-container">
//       <h1 className="checkout-title">Finalizar Compra</h1>

//       <form className="checkout-form" onSubmit={handleSubmit}>
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

//           <div className="form-group">
//             <label>Dirección</label>
//             <input
//               name="direccion"
//               value={values.direccion}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="Calle y número"
//             />
//             <span className="error">{showError('direccion')}</span>
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



