const jwt = require("jsonwebtoken")

 const verificador = (req, res, next) => {
    const autorizacion = req.get("Authorization");
    // console.log(autorizacion)
  
    if (!autorizacion) {
      const error = new Error("no autenticado, no hay JWT");
      error.statusCode = 401;
      throw error;
    }
  
    const token = autorizacion.split(" ")[1];
    let revisarToken;
    try {
      revisarToken = jwt.verify(token, "clavesecreta");
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  
    if (!revisarToken) {
      const error = new Error("No autenticado");
      error.statusCode = 401;
      throw error;
    }
    next();
  };

  module.exports = {verificador}