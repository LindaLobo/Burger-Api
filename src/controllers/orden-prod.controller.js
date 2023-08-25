const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "123456",
  database: "burgerqueen",
});

/* consultar los datos */

const getOrdenProd = async (req, res) => {
  try {
    // AQUI HICE UNA QUERY DONDE UNO LAS TRES TABLAS
    const response = await pool.query(
      "SELECT * FROM orden_productos inner join productos on orden_productos.id_prod = productos.id_prod inner join orden on orden.id_orden = orden_productos.id_orden WHERE orden.finalizado = false"
    );
    console.log(response.rows)
    // Crear un objeto para almacenar los grupos
    const groupedOrders = {};

    // // Iterar sobre cada elemento en el array de entrada
    for (const item of response.rows) {

      // Si el grupo aún no existe, crearlo
      if (!groupedOrders[item.id_orden]) {
        groupedOrders[item.id_orden] = {
          id_orden: item.id_orden,
          cliente_nombre: item.cliente,
          mesa: item.mesa,
          nombre_producto: [],
          precios: 0,
        };
      }

      // Agregar el nombre del producto al array del grupo
    
        groupedOrders[item.id_orden].nombre_producto.push(item.nombre_producto);
      

      // Sumar el precio al total del grupo
      groupedOrders[item.id_orden].precios += item.precios;
    }

    // Convertir el objeto de grupos a un array de objetos
    const resultArray = Object.values(groupedOrders);

    // console.log(resultArray);
    res.status(200).json(resultArray);
  } catch (error) {
    res.status(400).send("ERROR AL OBTENER LAS ORDENES-PRODUCTOS");
  }
};

module.exports = { getOrdenProd };
