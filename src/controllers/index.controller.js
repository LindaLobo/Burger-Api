const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "123456",
  database: "burgerqueen",
});

// para obtener por medio del id del empleado y por id_rol

const getbyIdRoles = async (req, res) => {
  try {
    const id_rol = req.params.id_rol;
    const response = await pool.query(
      "SELECT * FROM empleado WHERE id_rol = $1",
      [id_rol]
    );
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(400).send("ERROR AL OBTENER EL ID-ROL");
  }
};

const getbyIdEmployee = async (req, res) => {
  try {
    const id_empl = req.params.id_empl;
    const response = await pool.query(
      "SELECT * FROM empleado WHERE id_empl = $1",
      [id_empl]
    );
    res.status(200).json({id :response.rows});
  } catch (error) {
    res.status(400).send("ERROR AL OBTENER EL ID-EMPLEADO");
  }
};

//mostrar empleados en la ruta

const getEmployee = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM empleado");
    // console.log(response);
    res.status(200).json({empleados:response.rows});
  } catch (error) {
    res.status(400).send("ERROR AL OBTENER LOS EMPLEADOS");
  }
};

//creando un nuevo empleado

const createEmployee = async (req, res) => {
  try {
    let { nombre, password, id_rol, email } = req.body;
    password = await bcrypt.hash(req.body.password, 2)
    const response = await pool.query(
      "INSERT INTO empleado (nombre, password, id_rol, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, password, id_rol, email]
    );
    console.log(response.rows);
    res.status(201).json({
      message: "empleado creado",
      body: { nombre, password, id_rol, email },
    });
  } catch (error) {
    console.log(error)
    res.status(400).send("ERROR AL CREAR EL EMPLEADO");
  }
};

// pra eliminar a los usuarios

const deleteEmployee = async (req, res) => {
  try {
    const id_empl = req.params.id_empl;
    const response = await pool.query(
      "DELETE FROM empleado WHERE id_empl = $1",
      [id_empl]
    );
    console.log(response.rows);
    res.status(200).json(`empleado de id: ${id_empl} fue eliminado`);
  } catch (error) {
    res.status(400).send("ERROR AL ELIMINAR UN EMPLEADO")
    console.log(error);
  }
};

//para  actualizar los datos de algun empleado

const updateEmployee = async (req, res) => {
  try {
    const id_empl = req.params.id_empl;
    let { nombre, password, id_rol, email } = req.body;
    password = await bcrypt.hash(req.body.password, 2)
    const response = await pool.query(
      "UPDATE empleado SET nombre = $1, password = $2, id_rol = $3, email=$4 WHERE id_empl = $5 RETURNING *",
      [nombre, password, id_rol, email, id_empl]
    );
    res.status(201).json("empleado actualizado");
  } catch (error) {
    res.status(400).send("ERROR AL ACTUALIZAR UN EMPLEADO");
  }
};

// para autenticar al empleado

const autenticarEmpleado = async (req, res, next) => {
  const {nombre, password} = req.body
  const response = await pool.query (
    "SELECT * FROM empleado WHERE nombre=$1", [nombre]
  );
  const empleado = response.rows[0]
  // console.log(empleado)
  if(!empleado) {
    await res.status(401).send("EL EMPLEADO NO EXISTE");
    next();
  } else {
    if(!bcrypt.compareSync(password, empleado.password)){
      await res.status(401).send("CONTRASEÑA INCORRECTA")
      next();
    } else {
      const token = jwt.sign(
        {
        id_empleado: empleado.id_empl,
        nombre : empleado.nombre,
        id_rol : empleado.id_rol,
        email : empleado.email,
      }, 
      "clavesecreta"
      );
      res.json({token})
    }
  }
}

module.exports = {
  getEmployee,
  createEmployee,
  getbyIdRoles,
  getbyIdEmployee,
  deleteEmployee,
  updateEmployee,
  autenticarEmpleado
};
