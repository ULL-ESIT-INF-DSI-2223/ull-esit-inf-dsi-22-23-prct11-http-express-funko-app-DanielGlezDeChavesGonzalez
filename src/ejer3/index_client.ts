import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Tipos, Genero, asignarTipo, asignarGenero } from "./datatype/Tipos.js";
import * as chalk from "chalk";
import { Funko } from "./datatype/Funko.js";
import request from "request";

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

/**
 * realiza una peticion GET
 * @param req Peticion
 */
const showRequest = (req: RequestType) => {
  if (req.id) {
    const url = `http://localhost:3000/funko?user=${req.user}&id=${req.id}`;
    request.get(url, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        const res: ResponseType = JSON.parse(response.body);
        if (res.success) {
          let funkoPop = res.funkoPops;
          console.log("Funko encontrado:");
          console.log(funkoPop);
        } else {
          console.log("Funko no encontrado");
        }
      }
    });
  } else {
    const url = `http://localhost:3000/funko?user=${req.user}`;
    request.get(url, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        const res: ResponseType = JSON.parse(response.body);
        if (res.success) {
          console.log("Funkos encontrados:");
          console.log(res.funkoPops);
        } else {
          console.log("Funkos no encontrados");
        }
      }
    });
  }
};

/**
 * realiza una peticion POST
 * @param req Peticion
 */
const addRequest = (req: RequestType) => {
  if (req.funkoPop) {
    const url = `http://localhost:3000/funko?user=${req.user}&funkoPop=${req.funkoPop}`;
    request.post(
      url,
      {
        json: req,
      },
      (error, response) => {
        if (error) {
          console.log(error);
        } else {
          console.log(response.body);
          const res: ResponseType = JSON.parse(response.body);
          if (res.success) {
            console.log("Funko añadido");
          } else {
            console.log("Funko no añadido");
          }
        }
      }
    );
  }
};

/**
 * realiza una peticion DELETE
 * @param req Peticion
 */
const deleteRequest = (req: RequestType) => {
  if (req.id) {
    const url = `http://localhost:3000/funko?user=${req.user}&id=${req.id}`;
    request.delete(url, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        const res: ResponseType = JSON.parse(response.body);
        if (res.success) {
          console.log("Funko eliminado");
        } else {
          console.log("Funko no eliminado");
        }
      }
    });
  }
};

/**
 * realiza una peticion PATCH
 * @param req Peticion
 */
const updateRequest = (req: RequestType) => {
  if (req.id && req.funkoPop) {
    const url = `http://localhost:3000/funko?user=${req.user}&funkoPop=${req.funkoPop}`;
    request.patch(
      url,
      {
        json: req,
      },
      (error, response) => {
        if (error) {
          console.log(error);
        } else {
          const res: ResponseType = JSON.parse(response.body);
          if (res.success) {
            console.log("Funko actualizado");
          } else {
            console.log("Funko no actualizado");
          }
        }
      }
    );
  }
};

yargs(hideBin(process.argv))
  .command(
    "add",
    "Adds a funko",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Funko ID",
        type: "number",
        demandOption: true,
      },
      nombre: {
        description: "Funko name",
        type: "string",
        demandOption: true,
      },
      desc: {
        description: "Funko description",
        type: "string",
        demandOption: true,
      },
      tipo: {
        description: "Funko type",
        type: "string",
        demandOption: true,
      },
      genero: {
        description: "Genere of the funko",
        type: "string",
        demandOption: true,
      },
      franq: {
        description: "Funko franchise",
        type: "string",
        demandOption: true,
      },
      num_f: {
        description: "Funko franchise number",
        type: "number",
        demandOption: true,
      },
      exclusivo: {
        description: "Funko exclusive",
        type: "boolean",
        demandOption: true,
      },
      car_e: {
        description: "Funko special features",
        type: "string",
        demandOption: true,
      },
      precio: {
        description: "Funko price",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      let tipo: Tipos;
      let genero: Genero;
      tipo = asignarTipo(argv.tipo);
      genero = asignarGenero(argv.genero);
      if (tipo === Tipos.Error || genero === Genero.Error) {
        console.log("Tipo o genero invalido");
        return;
      }
      let FunkoPop: Funko = {
        id: argv.id,
        name: argv.nombre,
        description: argv.desc,
        Tipo: tipo,
        Genero: genero,
        Franquicia: argv.franq,
        Numero_franquicia: argv.num_f,
        Exclusivo: argv.exclusivo,
        Caracteristicas_especiales: argv.car_e,
        Precio: argv.precio,
      };

      let request: RequestType = {
        user: argv.user,
        funkoPop: FunkoPop,
      };

      addRequest(request);
    }
  )
  .help().argv;

yargs(hideBin(process.argv))
  .command(
    "list",
    "Shows all the funkos of a user",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      let request: RequestType = {
        user: argv.user,
      };

      showRequest(request);
    }
  )
  .help().argv;

yargs(hideBin(process.argv))
  .command(
    "read",
    "Shows a funko given an ID",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Funko ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      let request: RequestType = {
        user: argv.user,
        id: argv.id,
      };

      showRequest(request);
    }
  )
  .help().argv;

yargs(hideBin(process.argv))
  .command(
    "update",
    "Updates a funko",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Funko ID",
        type: "number",
        demandOption: true,
      },
      nombre: {
        description: "Funko name",
        type: "string",
        demandOption: true,
      },
      desc: {
        description: "Funko description",
        type: "string",
        demandOption: true,
      },
      tipo: {
        description: "Funko type",
        type: "string",
        demandOption: true,
      },
      genero: {
        description: "Genere of the funko",
        type: "string",
        demandOption: true,
      },
      franq: {
        description: "Funko franchise",
        type: "string",
        demandOption: true,
      },
      num_f: {
        description: "Funko franchise number",
        type: "number",
        demandOption: true,
      },
      exclusivo: {
        description: "Funko exclusive",
        type: "boolean",
        demandOption: true,
      },
      car_e: {
        description: "Funko special features",
        type: "string",
        demandOption: true,
      },
      precio: {
        description: "Funko price",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      let tipo: Tipos;
      let genero: Genero;
      tipo = asignarTipo(argv.tipo);
      genero = asignarGenero(argv.genero);
      if (tipo === Tipos.Error || genero === Genero.Error) {
        console.log("Tipo o genero invalido");
        return;
      }
      let FunkoPop: Funko = {
        id: argv.id,
        name: argv.nombre,
        description: argv.desc,
        Tipo: tipo,
        Genero: genero,
        Franquicia: argv.franq,
        Numero_franquicia: argv.num_f,
        Exclusivo: argv.exclusivo,
        Caracteristicas_especiales: argv.car_e,
        Precio: argv.precio,
      };

      let request: RequestType = {
        user: argv.user,
        funkoPop: FunkoPop,
      };

      updateRequest(request);
    }
  )
  .help().argv;

yargs(hideBin(process.argv))
  .command(
    "remove",
    "Removes a funko given an ID",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Funko ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      let request: RequestType = {
        user: argv.user,
        id: argv.id,
      };

      deleteRequest(request);
    }
  )
  .help().argv;
