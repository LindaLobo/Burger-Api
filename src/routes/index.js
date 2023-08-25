const { Router } = require("express");
const router = Router();
const { getEmployee,
  createEmployee,
  getbyIdRoles,
  getbyIdEmployee,
  deleteEmployee,
  updateEmployee
} = require("../controllers/index.controller");
const {getRoles, createRol, updateRol, deleteRol} =require('../controllers/roles.controller');
const {getOrden, createOrden, updateOrden, deleteOrden} = require('../controllers/orden.controller');
const {getProduct, createProduct, getProductId, updateProduct,deleteProduct, buscadorProductos} = require('../controllers/product.controller');
const {getOrdenProd} = require('../controllers/orden-prod.controller');
const {autenticarEmpleado} = require("../controllers/index.controller");
const {verificador} = require("../controllers/auth")

// rutas de empleados

router.get("/empleados", verificador, getEmployee);
router.post("/empleados", createEmployee);
router.get("/empleados/:id_rol", getbyIdRoles);
router.get("/empleado/:id_empl", getbyIdEmployee);
router.delete("/empleados/:id_empl", deleteEmployee);
router.put("/empleados/:id_empl", updateEmployee);

// rutas de roles

router.get("/roles", getRoles);
router.post("/roles", createRol);
router.put("/roles/:id_rol", updateRol);
router.delete("/roles/:id_rol", deleteRol);

//rutas de Ordenes 

router.get("/orden", getOrden);
router.post("/orden", createOrden);
router.put("/orden/:id_orden", updateOrden);
router.delete("/orden/:id_orden", deleteOrden)

//rutas productos

router.get("/productos", getProduct);
router.get("/productos/:id_prod", getProductId);
router.post("/productos", createProduct);
router.put("/productos/:id_prod", updateProduct);
router.delete("/productos/:id_prod", deleteProduct);

//buscador de productos
router.post('/productos/busqueda/:query', buscadorProductos)

// ruta de orden-productos

router.get("/orden-pro", getOrdenProd);

// ruta del login

router.post("/login", autenticarEmpleado);


module.exports = router;
