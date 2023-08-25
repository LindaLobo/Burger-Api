const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "123456",
  database: "burgerqueen",
});

//traer los productos

const getProduct = async (req, res) => {
    try {
      const response = await pool.query("SELECT * FROM productos");
      res.status(200).json({productos:response.rows});
    } catch (error) {
      res.status(400).send("ERROR AL OBTENER LOS PRODUCTOS");
    }
  };


// crear un producto

const createProduct = async (req, res) => {
    try {
      const { nombre_producto, stock, precios } = req.body;
      const response = await pool.query(
        "INSERT INTO productos (nombre_producto, stock, precios) VALUES ($1, $2, $3) RETURNING *",
        [nombre_producto, stock, precios]
      );
      console.log(response.rows);
      res.status(201).json({
        message: "producto agregado",
        body: { nombre_producto, stock, precios },
      });
    } catch (error) {
        console.log(error)
      res.status(400).send("ERROR AL AGREGAR UN PRODUCTO");
    }
  };

  //obtener el producto por el id

  const getProductId = async (req, res) => {
    try {
      const id_prod = req.params.id_prod;
      const response = await pool.query(
        "SELECT * FROM productos WHERE id_prod = $1",
        [id_prod]
      );
      res.status(200).json({id :response.rows});
    } catch (error) {
      res.status(400).send("ERROR AL OBTENER EL ID-EMPLEADO");
    }
  };


  // actualizar un producto

const updateProduct = async (req, res) => {
    try {
      const id_prod = req.params.id_prod;
      const { nombre_producto, stock, precios } = req.body;
      const response = await pool.query(
        "UPDATE productos SET nombre_producto = $1, stock = $2, precios =$3 WHERE id_prod = $4 RETURNING *",
        [nombre_producto, stock, precios, id_prod]
      );
      console.log(response.rows);
      res.status(201).json("producto actualizado");
    } catch (error) {
      res.status(400).send("ERROR AL ACTUALIZAR EL PRODUCTO");
    }
  };

//eliminar un producto

const deleteProduct = async (req, res) => {
    try {
      const id_prod = req.params.id_prod;
      const response = await pool.query("DELETE FROM productos WHERE id_prod = $1", [
        id_prod,
      ]);
      console.log(response.rows);
      res.status(200).json("el producto fue eliminado");
    } catch (error) {
      res.status(400).send("ERROR AL ELIMINAR EL PRODUCTO");
      console.log(error)
    }
  };

//Generando un buscador para los productos

const buscadorProductos = async(req, res) => {
  try {
    const query = req.params.query; // Cambia a req.params.query para obtener el valor de búsqueda desde la URL
    const response = await pool.query(
      "SELECT * FROM productos WHERE nombre_producto ILIKE $1",
      [`%${query}%`]
    );
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(400).send("ERROR PARA ENCONTRAR EL PRODUCTO");
    console.log(error)
  }
}

module.exports = {getProduct, createProduct, getProductId, updateProduct, deleteProduct, buscadorProductos}