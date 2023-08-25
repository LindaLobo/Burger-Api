const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "123456",
  database: "burgerqueen",
});

//traer las ordenes

const getOrden = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM orden");
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(400).send("ERROR AL OBTENER LAS ORDENES");
  }
};

// crear una orden

const createOrden = async (req, res) => {
  try {
    await pool.query("BEGIN")
    const { cliente, mesa, finalizado, id_empl, productos_ids } = req.body;
    const response = await pool.query(
      "INSERT INTO orden (cliente, mesa, finalizado, id_empl) VALUES ($1, $2, $3, $4) RETURNING *",
      [cliente, mesa, finalizado, id_empl]
    );
    console.log(response.rows);
    const productos = req.body.productos_ids
    const id_orden = response.rows[0].id_orden;
    // console.log(productos, "aqui" )
    for(let element of productos) {
        // console.log(element)
        await pool.query("UPDATE productos SET stock = stock-1 WHERE id_prod =$1", [element]);
        await pool.query("INSERT INTO orden_productos (id_orden, id_prod) VALUES ($1, $2)", [id_orden, element] );
    };
    await pool.query("COMMIT");
    res.status(201).json({
      message: "orden creada",
      body: { cliente, mesa, finalizado, id_empl, productos_ids },
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error)
    //rollback
    res.status(400).send("ERROR AL CREAR LA ORDEN");
  }
};

// actualizar la orden

const updateOrden = async (req, res) => {
  try {
    const id_orden = req.params.id_orden;
    const { cliente, mesa, finalizado, id_empl } = req.body;
    const response = await pool.query(
      "UPDATE orden SET cliente = $1, mesa = $2, finalizado = $3, id_empl = $4 WHERE id_orden = $5 RETURNING *",
      [cliente, mesa, finalizado, id_empl, id_orden]
    );
    console.log(response.rows);
    res.status(201).json({
      message: "orden actualizada",
      body: { cliente, mesa, finalizado, id_empl, id_orden },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR AL ACTUALIZAR LA ORDEN");
  }
};

// eliminar una orden

const deleteOrden = async (req, res) => {
    try {
      await pool.query("BEGIN")
      const id_orden = req.params.id_orden;
      const response = await pool.query("DELETE FROM orden_productos WHERE id_orden = $1", [
        id_orden,
      ]);
      const responseDos = await pool.query("DELETE FROM orden WHERE id_orden = $1", [
        id_orden,
      ]);
      console.log(response);
      await pool.query("COMMIT")
      res.status(200).json("la orden fue eliminada");
    } catch (error) {
      await pool.query("ROLLBACK");
      console.log(error)
      res.status(400).send("ERROR AL ELIMINAR LA ORDEN");
    }
  };

module.exports = { getOrden, createOrden, updateOrden, deleteOrden };
