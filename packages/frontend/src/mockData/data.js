

export const MOCK_SELLER_1 = {
  id: 'user-1',
  name: 'Osqui123',
  email: 'osqui123@example.com',
  phone: '123-456-7890',
  type: 'VENDEDOR',
  signupDate: new Date().toISOString(),
};

export const MOCK_SELLER_2 = {
  id: 'user-3',
  name: 'Moda Urbana',
  email: 'moda@example.com',
  phone: '321-654-0987',
  type: 'VENDEDOR',
  signupDate: new Date().toISOString(),
};

export const MOCK_SELLER_3 = {
  id: 'user-4',
  name: 'Tecno Hogar',
  email: 'tecno@example.com',
  phone: '456-789-0123',
  type: 'VENDEDOR',
  signupDate: new Date().toISOString(),
};


export const MOCK_BUYER = {
    id: 'user-2',
    name: 'Comprador Anónimo',
    email: 'buyer@example.com',
    phone: '098-765-4321',
    type: 'COMPRADOR',
    signupDate: new Date().toISOString(),
}

const MOCK_CATEGORIES = [
    { name: 'Ropa' }, { name: 'Electrónica' }, { name: 'Hogar' }, { name: 'Deportes' }, { name: 'Juguetes' }
];

export const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    seller: MOCK_SELLER_1,
    title: 'Camiseta de Algodón Premium',
    description: 'Una camiseta suave y duradera, perfecta para el uso diario. Hecha 100% de algodón peinado.',
    categories: [MOCK_CATEGORIES[0]],
    price: 25.99,
    currency: 'USD',
    stock: 50,
    photos: ['https://picsum.photos/seed/prod1/600/600'],
    isActive: true,
  },
  {
    id: 'prod-2',
    seller: MOCK_SELLER_3,
    title: 'Auriculares Inalámbricos Pro',
    description: 'Experimenta un sonido cristalino con cancelación de ruido activa. Hasta 24 horas de batería.',
    categories: [MOCK_CATEGORIES[1]],
    price: 129.50,
    currency: 'USD',
    stock: 25,
    photos: ['https://picsum.photos/seed/prod2/600/600'],
    isActive: true,
  },
  {
    id: 'prod-3',
    seller: MOCK_SELLER_3,
    title: 'Sartén Antiadherente de Cerámica',
    description: 'Cocina de forma más saludable con nuestra sartén ecológica. Apta para todo tipo de cocinas.',
    categories: [MOCK_CATEGORIES[2]],
    price: 45.00,
    currency: 'USD',
    stock: 100,
    photos: ['https://picsum.photos/seed/prod3/600/600'],
    isActive: true,
  },
  {
    id: 'prod-4',
    seller: MOCK_SELLER_2,
    title: 'Zapatillas de Running Ultraligeras',
    description: 'Corre más rápido y más lejos con estas zapatillas diseñadas para el máximo rendimiento y comodidad.',
    categories: [MOCK_CATEGORIES[3]],
    price: 89.99,
    currency: 'USD',
    stock: 40,
    photos: ['https://picsum.photos/seed/prod4/600/600'],
    isActive: true,
  },
  {
    id: 'prod-5',
    seller: MOCK_SELLER_1,
    title: 'Juego de Bloques de Construcción',
    description: 'Fomenta la creatividad de los más pequeños con este set de 500 bloques de colores vivos.',
    categories: [MOCK_CATEGORIES[4]],
    price: 35.20,
    currency: 'USD',
    stock: 80,
    photos: ['https://picsum.photos/seed/prod5/600/600'],
    isActive: true,
  },
  {
    id: 'prod-6',
    seller: MOCK_SELLER_3,
    title: 'Lámpara de Escritorio LED',
    description: 'Iluminación ajustable con 5 niveles de brillo y 3 modos de color. Diseño moderno y minimalista.',
    categories: [MOCK_CATEGORIES[2], MOCK_CATEGORIES[1]],
    price: 29.99,
    currency: 'USD',
    stock: 60,
    photos: ['https://picsum.photos/seed/prod6/600/600'],
    isActive: true,
  },
    {
    id: 'prod-7',
    title: 'Mochila Urbana Impermeable',
    seller: MOCK_SELLER_2,
    description: 'Mochila con compartimento para portátil de 15\' y múltiples bolsillos. Ideal para el día a día.',
    categories: [MOCK_CATEGORIES[0]],
    price: 55.00,
    currency: 'USD',
    stock: 30,
    photos: ['https://picsum.photos/seed/prod7/600/600'],
    isActive: true,
  },
  {
    id: 'prod-8',
    title: 'Botella de Agua de Acero Inoxidable',
    seller: MOCK_SELLER_1,
    description: 'Mantiene tus bebidas frías por 24 horas o calientes por 12. Capacidad de 750ml, libre de BPA.',
    categories: [MOCK_CATEGORIES[3], MOCK_CATEGORIES[2]],
    price: 19.95,
    currency: 'USD',
    stock: 120,
    photos: ['https://picsum.photos/seed/prod8/600/600'],
    isActive: true,
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    recipient: MOCK_SELLER_1,
    title: '¡Nuevo Pedido!',
    message: 'Has recibido un nuevo pedido (#12345) de Comprador Anónimo.',
    creationDate: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-2',
    recipient: MOCK_SELLER_1,
    title: 'Envío Confirmado',
    message: 'Tu pedido #12344 ha sido enviado. Llegará en 3 días hábiles.',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-3',
    recipient: MOCK_SELLER_1,
    title: 'Producto Agotándose',
    message: 'Quedan menos de 5 unidades de "Auriculares Inalámbricos Pro".',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
    readDate: new Date().toISOString(),
  },
  {
    id: 'notif-4',
    recipient: MOCK_SELLER_1,
    title: 'Pago Recibido',
    message: 'El pago para el pedido #12343 ha sido procesado correctamente.',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isRead: true,
    readDate: new Date().toISOString(),
  }
];


export const MOCK_ORDERS = [
    {
        id: 'order-1',
        buyer: MOCK_BUYER,
        items: [
            { product: MOCK_PRODUCTS[0], quantity: 1, unitPrice: 25.99, subtotal: 25.99 },
            { product: MOCK_PRODUCTS[2], quantity: 1, unitPrice: 45.00, subtotal: 45.00 }
        ],
        total: 70.99,
        currency: 'USD',
        deliveryAddress: { street: 'Av. Siempre Viva', number: '742', city: 'Springfield', province: 'Springfield', postalCode: '12345', country: 'USA' },
        status: 'PENDIENTE',
        creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        statusHistory: []
    },
    {
        id: 'order-2',
        buyer: MOCK_BUYER,
        items: [
            { product: MOCK_PRODUCTS[3], quantity: 2, unitPrice: 89.99, subtotal: 179.98 }
        ],
        total: 179.98,
        currency: 'USD',
        deliveryAddress: { street: 'Calle Falsa', number: '123', city: 'Buenos Aires', province: 'CABA', postalCode: 'C1000', country: 'Argentina' },
        status: 'ENVIADO',
        creationDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        statusHistory: []
    }
];

export const MOCK_SALES = MOCK_ORDERS.map(order => ({ ...order, buyer: MOCK_BUYER }));