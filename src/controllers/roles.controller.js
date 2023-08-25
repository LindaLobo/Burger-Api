const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "123456",
  database: "burgerqueen",
});

//traer los roles

const getRoles = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM roles");
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(400).send("ERROR AL OBTENER LOS ROLES");
  }
};

//crear un rol

const createRol = async (req, res) => {
  try {
    const { nombre } = req.body;
    const response = await pool.query(
      "INSERT INTO roles (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    console.log(response.rows);
    res.status(201).json({
      message: "rol creado",
      body: { nombre },
    });
  } catch (error) {
    res.status(400).send("ERROR AL CREAR EL ROL");
  }
};

// actualizar un rol

const updateRol = async (req, res) => {
  try {
    const id_rol = req.params.id_rol;
    const { nombre } = req.body;
    const response = await pool.query(
      "UPDATE roles SET nombre = $1 WHERE id_rol = $2 RETURNING *",
      [nombre, id_rol]
    );
    console.log(response);
    res.status(201).json("rol actualizado");
  } catch (error) {
    res.status(400).send("ERROR AL ACTUALIZAR EL ROL");
  }
};

//eliminar un rol

const deleteRol = async (req, res) => {
  try {
    const id_rol = req.params.id_rol;
    const response = await pool.query("DELETE FROM roles WHERE id_rol = $1", [
      id_rol,
    ]);
    console.log(response);
    res.status(200).json("el rol fue eliminado");
  } catch (error) {
    res.status(400).send("ERROR AL ELIMINAR EL ROL");
  }
};

module.exports = { getRoles, createRol, updateRol, deleteRol };
