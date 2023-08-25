const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { app } = require("../src/index");
const expect = chai.expect;
const jwt = require("jsonwebtoken");

describe("api burgerqueen", () => {
  describe("get /empleados", () => {
    it("deberia devolver un array con los empleados", async () => {
      // Genera un token JWT válido que será usado para autenticar la solicitud en el middleware
      const token = jwt.sign(
        {
          nombre: "nombreDelEmpleado",
          id_rol: "idDelRol",
          email: "emailDelEmpleado",
        },
        "clavesecreta",
        { expiresIn: "1h" }
      );
      const response = await chai
        .request(app)
        .get("/empleados")
        .set("Authorization", `Bearer ${token}`); // Agrega el encabezado de autorización con el token JWT
      expect(response).to.have.status(200);
      expect(response.body).to.have.property("empleados").that.is.an("array");
    });
    it("deberia devolver un empleado especifico por su id", async () => {
      const id_empl = 2;
      const res = await chai.request(app).get(`/empleado/${id_empl}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.a("object");
    });
    it("deberia retornar que el empleado no existe", async () => {
      const idFalso = 3.3;
      const res = await chai.request(app).get(`/empleado/${idFalso}`);
      expect(res).to.have.status(400);
    });
  


  //   describe("post de empleados", () => {
  //     it("deberia crear un empleado", async()=> {
  //         const empleados = {nombre:"joel", password:"joel12", id_rol:"2", email:"joel1@bq.cl"}
  //         const res = await chai.request(app).post("/empleados").send(empleados)
  //         expect(res).to.have.status(201)
  //     })
  // })

  describe("delete de empleado", () => {
    it("deberia eliminar un empleado existente", async () => {
      const id_empl = 26;
      const res = await chai.request(app).delete(`/empleados/${id_empl}`);
      expect(res).to.have.status(200);
      expect(res.text).to.equal(`"empleado de id: ${id_empl} fue eliminado"`);
    });
    it("deberia retornar un error al intentar eliminar un empleado inexistente", async () => {
      const id_empl = 3.3;
      const res = await chai.request(app).delete(`/empleados/${id_empl}`);
      expect(res).to.have.status(400);
    });
  });
});

  describe("get /productos", () => {
    it("deberia devolver un array con los productos", async ()=> {
        const response = await chai.request(app).get("/productos")
        expect(response).to.have.status(200)
        expect(response.body).to.have.property("productos").that.is.a("array")
    })
  });
  describe("post de productos", () => {
    it("deberia crear un producto", async()=> {
        const producto = {nombre_producto:"agua", stock:"10", precios:"1000"}
        const res = await chai.request(app).post("/productos").send(producto)
        expect(res).to.have.status(201)
    })
})



});
