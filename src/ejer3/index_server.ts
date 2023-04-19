import { App } from "./FunkoApp.js";
import { Funko } from "./datatype/Funko.js";
import * as net from "net";
import express from "express";

/**
 * Tipo de peticion
 */
export type RequestType = {
  type: "add" | "update" | "remove" | "read" | "list";
  user: string;
  funkoPop?: Funko;
  id?: number;
};

/**
 * Tipo de respuesta
 */
export type ResponseType = {
  type: "add" | "update" | "remove" | "read" | "list";
  user: string;
  success: boolean;
  funkoPop?: Funko;
  funkolist?: Funko[];
};

const servidor = express();

servidor.get(
  "/funko",
  (
    req: {
      query: {
        user: string;
        type: "add" | "update" | "remove" | "read" | "list";
        funkoPop?: Funko;
        id?: number;
      };
    },
    res: {
      send: (arg0: {
        error?: string;
        type?: "add" | "update" | "remove" | "read" | "list";
        user?: string;
        success?: boolean;
        funkoPop?: Funko | undefined;
        funkolist?: Funko[] | undefined;
      }) => void;
    }
  ) => {
    if (!req.query.user) {
      return res.send({
        error: "error 404 - no se ha proporcionado un usuario ",
      });
    }
    if (!req.query.type) {
      return res.send({
        error: "error 404 - no se ha proporcionado un tipo de peticion ",
      });
    }
    if (req.query.type == "add") {
      if (!req.query.funkoPop) {
        return res.send({
          error: "error 404 - no se ha proporcionado un funko ",
        });
      }
      const app = new App(req.query.user);
      app.cargarDatos(req.query.user);
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
        let response: ResponseType = {
          type: "add",
          user: req.query.user,
          success: true,
        };
        res.send(response);
      } else {
        let response: ResponseType = {
          type: "add",
          user: req.query.user,
          success: false,
        };
        res.send(response);
      }
    }
    if (req.query.type == "list") {
      const app = new App(req.query.user);
      app.cargarDatos(req.query.user);
      let list = app.listFunkos();
      let response: ResponseType = {
        type: "list",
        user: req.query.user,
        success: true,
        funkolist: list,
      };
      res.send(response);
    }
    if (req.query.type == "read") {
      if (!req.query.id) {
        return res.send({
          error: "error 404 - no se ha proporcionado un id ",
        });
      }
      const app = new App(req.query.user);
      app.cargarDatos(req.query.user);
      let read = app.showFunkoById(req.query.id);
      let response: ResponseType = {
        type: "read",
        user: req.query.user,
        success: true,
        funkoPop: read,
      };
      res.send(response);
    }
    if (req.query.type == "update") {
      if (!req.query.funkoPop) {
        return res.send({
          error: "error 404 - no se ha proporcionado un funko ",
        });
      }
      if (!req.query.id) {
        return res.send({
          error: "error 404 - no se ha proporcionado un id ",
        });
      }
      const app = new App(req.query.user);
      app.cargarDatos(req.query.user);
      let updated = app.modifyFunko(
        req.query.id,
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
      if (updated) {
        let response: ResponseType = {
          type: "update",
          user: req.query.user,
          success: true,
        };
        res.send(response);
      } else {
        let response: ResponseType = {
          type: "update",
          user: req.query.user,
          success: false,
        };
        res.send(response);
      }
    }
    if (req.query.type == "remove") {
      if (!req.query.id) {
        return res.send({
          error: "error 404 - no se ha proporcionado un id ",
        });
      }
      const app = new App(req.query.user);
      app.cargarDatos(req.query.user);
      let removed = app.removeFunko(req.query.id);
      app.guardarDatos();
      if (removed) {
        let response: ResponseType = {
          type: "remove",
          user: req.query.user,
          success: true,
        };
        res.send(response);
      } else {
        let response: ResponseType = {
          type: "remove",
          user: req.query.user,
          success: false,
        };
        res.send(response);
      }
    }
  }
);

servidor.listen(3000, () => {
  console.log("Servidor funcionando");
});
