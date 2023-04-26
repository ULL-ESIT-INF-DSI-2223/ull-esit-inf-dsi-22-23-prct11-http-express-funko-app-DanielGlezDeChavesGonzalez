import {
  Tipos,
  Genero,
  asignarGenero,
  asignarTipo,
} from "../ejer3/datatype/Tipos.js";
import { App } from "./FunkoApp.js";
import { Funko } from "./datatype/Funko.js";
import express from "express";
import { MongoClient } from "mongodb";

interface TipoFunko {
  myid: number;
  name: string;
  description: string;
  Tipo: Tipos;
  Genero: Genero;
  Franquicia: string;
  Numero_franquicia: number;
  Exclusivo: boolean;
  Caracteristicas_especiales: string;
  Precio: number;
}

const dbURL = "mongodb://127.0.0.1:27017";
const dbNameCollection = "FunkoDB";
/**
 * Tipo de peticion
 */
export type RequestType = {
  user: string;
  funkoPop?: Funko;
  myid?: number;
};

/**
 * Tipo de respuesta
 */
export type ResponseType = {
  success: boolean;
  funkoPops?: Funko[];
};

const servidor = express();

servidor.use(express.json());

servidor.get(
  "/funko",
  (
    req: {
      query: {
        user: string;
        funkoPop?: Funko;
        myid?: number;
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
    //list
    MongoClient.connect(dbURL).then(async (client) => {
      const db = client.db(req.query.user);

      if (!req.query.myid) {
        try {
          const funko = await db
            .collection<TipoFunko>("Funko")
            .find({})
            .toArray();
          console.log(funko);
          return res.send({
            success: true,
          });
        } catch (error) {
          console.log(error);
          return res.send({
            success: false,
          });
        }
      } else {
        // list one funko
        try {
          const funko_1 = await db
            .collection<TipoFunko>("Funko")
            .findOne({ id: req.query.myid });
          console.log(funko_1);
          return res.send({
            success: true,
          });
        } catch (error_1) {
          console.log(error_1);
          return res.send({
            success: false,
          });
        }
      }
    });
  }
);

servidor.post(
  "/funko",
  (
    req: {
      query: {
        user: string;
        funkoPop?: Funko;
        myid?: number;
      };
    },
    res: {
      send: (arg0: ResponseType) => void;
    }
  ) => {
    if (!req.query.user) {
      console.log("no user");
      return res.send({
        success: false,
      });
    }
    if (!req.query.funkoPop) {
      console.log("no funko");
      return res.send({
        success: false,
      });
    }
    MongoClient.connect(dbURL).then((client) => {
      const db = client.db(req.query.user);
      if (req.query.funkoPop !== undefined) {
        let funkoleido: Funko = req.query.funkoPop;
        return db
          .collection<TipoFunko>("Funko")
          .insertOne({
            myid: req.query.funkoPop.myid,
            name: req.query.funkoPop.name,
            description: req.query.funkoPop.description,
            Tipo: asignarTipo(req.query.funkoPop.Tipo),
            Genero: asignarGenero(req.query.funkoPop.Genero),
            Franquicia: req.query.funkoPop.Franquicia,
            Numero_franquicia: req.query.funkoPop.Numero_franquicia,
            Exclusivo: req.query.funkoPop.Exclusivo,
            Caracteristicas_especiales:
              req.query.funkoPop.Caracteristicas_especiales,
            Precio: req.query.funkoPop.Precio,
          })
          .then((funko) => {
            console.log(funkoleido);
            console.log(funkoleido.myid);
            console.log(funko);
            return res.send({
              success: true,
            });
          })
          .catch((error) => {
            console.log(error);
            return res.send({
              success: false,
            });
          });
      }
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
        myid?: number;
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
    if (!req.query.myid) {
      return res.send({
        success: false,
      });
    }
    MongoClient.connect(dbURL).then(async (client) => {
      const db = client.db(req.query.user);
      try {
        const funko = await db
          .collection<TipoFunko>("Funko")
          .deleteOne({ id: req.query.myid });
        console.log(funko);
        return res.send({
          success: true,
        });
      } catch (error) {
        console.log(error);
        return res.send({
          success: false,
        });
      }
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
        myid?: number;
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
    MongoClient.connect(dbURL).then((client) => {
      const db = client.db(req.query.user);
      if (req.query.funkoPop !== undefined) {
        return db
          .collection<TipoFunko>("Funko")
          .updateOne(
            { myid: req.query.funkoPop.myid },
            {
              $set: {
                name: req.query.funkoPop.name,
                description: req.query.funkoPop.description,
                Tipo: asignarTipo(req.query.funkoPop.Tipo),
                Genero: asignarGenero(req.query.funkoPop.Genero),
                Franquicia: req.query.funkoPop.Franquicia,
                Numero_franquicia: req.query.funkoPop.Numero_franquicia,
                Exclusivo: req.query.funkoPop.Exclusivo,
                Caracteristicas_especiales:
                  req.query.funkoPop.Caracteristicas_especiales,
                Precio: req.query.funkoPop.Precio,
              },
            }
          )
          .then((funko) => {
            console.log(funko);
            return res.send({
              success: true,
            });
          })
          .catch((error) => {
            console.log(error);
            return res.send({
              success: false,
            });
          });
      }
    });
  }
);

servidor.listen(3000, () => {
  console.log("Servidor funcionando");
});
