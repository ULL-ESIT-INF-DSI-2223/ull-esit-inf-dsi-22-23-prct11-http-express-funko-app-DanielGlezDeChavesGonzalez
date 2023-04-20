import { App } from "./FunkoApp.js";
import { Funko } from "./datatype/Funko.js";
import express from "express";

/**
 * Tipo de peticion
 */
export type RequestType = {
  user: string;
  funkoPop?: Funko;
  id?: number;
};

/**
 * Tipo de respuesta
 */
export type ResponseType = {
  success: boolean;
  funkoPops?: Funko[];
};

const servidor = express();

servidor.get(
  "/funko",
  (
    req: {
      query: {
        user: string;
        funkoPop?: Funko;
        id?: number;
      };
    },
    res: {
      send: (arg0: ResponseType) => void;
    }
  ) => {
    if (!req.query.user) {
      return res.send({
        success: false,
      });
    }
    const app = new App(req.query.user);
    app.cargarDatos(req.query.user);
    if (req.query.id) {
      const funkoPop = app.showFunkoById(req.query.id);
      if (funkoPop) {
        return res.send({
          success: true,
          funkoPops: [funkoPop],
        });
      } else {
        return res.send({
          success: false,
        });
      }
    } else {
      return res.send({
        success: true,
        funkoPops: app.listFunkos(),
      });
    }
  }
);

servidor.post(
  "/funko",
  (
    req: {
      query: {
        user: string;
        funkoPop?: Funko;
        id?: number;
      };
    },
    res: {
      send: (arg0: ResponseType) => void;
    }
  ) => {
    if (!req.query.user) {
      return res.send({
        success: false,
      });
    }
    if (!req.query.funkoPop) {
      return res.send({
        success: false,
      });
    }
    const app = new App(req.query.user);
    app.cargarDatos(req.query.user);
    console.log(req.query.funkoPop.id);
    console.log(req.query.funkoPop.name);
    console.log(req.query.funkoPop.description);
    console.log(req.query.funkoPop.Tipo);
    console.log(req.query.funkoPop.Genero);
    console.log(req.query.funkoPop.Franquicia);
    console.log(req.query.funkoPop.Numero_franquicia);
    console.log(req.query.funkoPop.Exclusivo);
    console.log(req.query.funkoPop.Caracteristicas_especiales);
    console.log(req.query.funkoPop.Precio);

    let added = app.addFunko(
      req.query.user,
      req.query.funkoPop.id,
      req.query.funkoPop.name,
      req.query.funkoPop.description,
      req.query.funkoPop.Tipo,
      req.query.funkoPop.Genero,
      req.query.funkoPop.Franquicia,
      req.query.funkoPop.Numero_franquicia,
      req.query.funkoPop.Exclusivo,
      req.query.funkoPop.Caracteristicas_especiales,
      req.query.funkoPop.Precio
    );
    app.guardarDatos();
    if (added) {
      return res.send({
        success: true,
      });
    }
    return res.send({
      success: false,
    });
  }
);

servidor.delete(
  "/funko",
  (
    req: {
      query: {
        user: string;
        funkoPop?: Funko;
        id?: number;
      };
    },
    res: {
      send: (arg0: ResponseType) => void;
    }
  ) => {
    if (!req.query.user) {
      return res.send({
        success: false,
      });
    }
    if (!req.query.id) {
      return res.send({
        success: false,
      });
    }
    const app = new App(req.query.user);
    app.cargarDatos(req.query.user);
    let removed = app.removeFunko(req.query.id);
    app.guardarDatos();
    if (removed) {
      return res.send({
        success: true,
      });
    }
    return res.send({
      success: false,
    });
  }
);

servidor.patch(
  "/funko",
  (
    req: {
      query: {
        user: string;
        funkoPop?: Funko;
        id?: number;
      };
    },
    res: {
      send: (arg0: ResponseType) => void;
    }
  ) => {
    if (!req.query.user) {
      return res.send({
        success: false,
      });
    }
    if (!req.query.funkoPop) {
      return res.send({
        success: false,
      });
    }
    const app = new App(req.query.user);
    app.cargarDatos(req.query.user);
    let modificado = app.modifyFunko(
      req.query.funkoPop.id,
      req.query.funkoPop.name,
      req.query.funkoPop.description,
      req.query.funkoPop.Tipo,
      req.query.funkoPop.Genero,
      req.query.funkoPop.Franquicia,
      req.query.funkoPop.Numero_franquicia,
      req.query.funkoPop.Exclusivo,
      req.query.funkoPop.Caracteristicas_especiales,
      req.query.funkoPop.Precio
    );
    app.guardarDatos();
    if (modificado) {
      return res.send({
        success: true,
      });
    }
    return res.send({
      success: false,
    });
  }
);

servidor.listen(3000, () => {
  console.log("Servidor funcionando");
});
