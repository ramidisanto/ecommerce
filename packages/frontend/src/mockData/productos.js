const productos = [
    {
        id: 1,
        vendedorId: 101,
        titulo: "Laptop Pro Avanzada X15",
        descripcion:
            "Potente laptop para desarrollo y diseño. Equipada con procesador i7 de 13va generación, 32GB de RAM DDR5 y 1TB SSD NVMe. Pantalla OLED 4K de 15.6 pulgadas.",
        categorias: ["Computación", "Laptops", "Tecnología"],
        precio: 1950000,
        moneda: "ARS",
        stock: 25,
        fotos: ["/images/laptopPro.jpg"],
        activo: true,
        ventas: 12,
    },
    {
        id: 2,
        vendedorId: 102,
        titulo: "Monitor Curvo Ultrawide 34\"",
        descripcion:
            "Monitor curvo ultrawide de 34 pulgadas, resolución WQHD (3440x1440) y 144Hz de tasa de refresco. Ideal para gaming y productividad multitarea.",
        categorias: ["Computación", "Monitores", "Periféricos"],
        precio: 890000,
        moneda: "ARS",
        stock: 40,
        fotos: ["/images/monitorHighQuality.jpeg"],
        activo: true,
        ventas: 28,
    },
    {
        id: 3,
        vendedorId: 101,
        titulo: "Teclado Mecánico Inalámbrico TKL",
        descripcion:
            "Teclado mecánico formato TKL (tenkeyless) con switches Brown. Triple conectividad: Bluetooth, 2.4GHz y USB-C. Iluminación RGB personalizable.",
        categorias: ["Computación", "Periféricos", "Gaming"],
        precio: 120000,
        moneda: "ARS",
        stock: 150,
        fotos: ["/images/teclado.jpeg"],
        activo: true,
        ventas: 65,
    },
    {
        id: 4,
        vendedorId: 103,
        titulo: "Cafetera Superautomática Express",
        descripcion:
            "Cafetera express que muele el grano en el acto. 19 bares de presión, vaporizador para leche y panel táctil. Prepara Espresso, Cappuccino y Latte con un botón.",
        categorias: ["Hogar", "Electrodomésticos", "Cocina"],
        precio: 480000,
        moneda: "ARS",
        stock: 30,
        fotos: ["/images//cafeterA.jpeg"],
        activo: true,
        ventas: 18,
    },
    {
        id: 5,
        vendedorId: 104,
        titulo: "Silla de Oficina Ergonómica Premium",
        descripcion:
            "Silla ergonómica con soporte lumbar ajustable, apoyabrazos 4D, cabezal regulable y malla transpirable de alta densidad. Base de aluminio.",
        categorias: ["Hogar", "Muebles", "Oficina"],
        precio: 310000,
        moneda: "ARS",
        stock: 60,
        fotos: ["/images/sillaPremium.jpeg"],
        activo: true,
        ventas: 45,
    }

];

export default productos;