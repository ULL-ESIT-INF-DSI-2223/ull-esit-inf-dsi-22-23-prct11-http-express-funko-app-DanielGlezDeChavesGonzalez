[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-DanielGlezDeChavesGonzalez/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-DanielGlezDeChavesGonzalez?branch=main)[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-DanielGlezDeChavesGonzalez&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-DanielGlezDeChavesGonzalez)

# Practica 11: Servidor express

## Descripción

En esta practica desarrollaremos un servidor express que nos permita realizar peticiones GET, POST, PATCH y DELETE a una base de datos de archivos .json en el entorno de ejecucion del servidor. Para esta practica se utilizara como base el proyecto de la practica 10 que contiene la clase Funko y la clase FunkoApp.

## Cliente express

Para el cliente podemos hacer uso de la herramienta Thunder Client de Visual Studio Code, la cual nos permite realizar peticiones HTTP de forma sencilla y visual. A su vez tambien podremos hacer peticiones a traves del cliente desarrollado utilizando yarg y request.

```typescript
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
```

Para ejecutar las peticiones haremos uso de funciones con patron callback las cuales se llamaran desde el yarg ,ya usado en anteriorers practicas, analizando los argumentos que se le pasan. Para generar la peticion http utilizaremos la libreria request. Primero analizaremos los argumentos que se le pasan al comando yarg y en funcion de estos generaremos la peticion correspondiente. Para ello utilizaremos la funcion request.get, request.post, request.delete y request.patch. Estas funciones reciben como primer parametro la url a la que se le hara la peticion y como segundo parametro un objeto con la peticion en formato json. En caso de que la peticion sea correcta se ejecutara la funcion callback pasandole como primer parametro un error y como segundo parametro la respuesta. En caso de que la peticion sea correcta se mostrara por consola la respuesta del servidor.

## Servidor express

```typescript
**
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
```

Para la peticion http de tipo GET utilizaremos la funcion servidor.get. En esta primero se cargaran los datos del usuario en la aplicacion y se analizara si se ha pasado un id como parametro. En caso de que se haya pasado un id se devolvera el funkoPop con ese id y en caso de que no se haya pasado un id se devolveran todos los funkoPops del usuario. En caso de que no se haya pasado un usuario se devolvera un objeto con el atributo success a false.

```typescript

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
```

Para la peticion http de tipo POST utilizaremos la funcion servidor.post. En esta primero se cargaran los datos del usuario en la aplicacion y se analizara si se ha pasado un funkoPop como parametro. En caso de que se haya pasado un funkoPop se intentara añadir el funkoPop y se devolvera un objeto con el atributo success a true en caso de que se haya añadido correctamente y a false en caso de que no se haya añadido correctamente. En caso de que no se haya pasado un funkoPop se devolvera un objeto con el atributo success a false.

```typescript
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
```

Para la peticion http de tipo DELETE utilizaremos la funcion servidor.delete. En esta primero se cargaran los datos del usuario en la aplicacion y se analizara si se ha pasado un id como parametro. En caso de que se haya pasado un id se intentara eliminar el funkoPop con ese id y se devolvera un objeto con el atributo success a true en caso de que se haya eliminado correctamente y a false en caso de que no se haya eliminado correctamente. En caso de que no se haya pasado un id se devolvera un objeto con el atributo success a false.

```typescript
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
```

Para la peticion http de tipo PATCH utilizaremos la funcion servidor.patch. En esta primero se cargaran los datos del usuario en la aplicacion y se analizara si se ha pasado un funkoPop como parametro. En caso de que se haya pasado un funkoPop se intentara modificar el funkoPop con ese id y se devolvera un objeto con el atributo success a true en caso de que se haya modificado correctamente y a false en caso de que no se haya modificado correctamente. En caso de que no se haya pasado un funkoPop se devolvera un objeto con el atributo success a false.

```typescript

servidor.listen(3000, () => {
  console.log("Servidor funcionando");
});
```

Por ultimo se ejecutara la funcion servidor.listen para que el servidor empiece a escuchar peticiones http.

## Modificacion propuesta en clase

```typescript
const app = express();

app.get("/weather", (req, res) => {
  if (!req.query.location) {
    return res.status(400).send({
      error: "You must provide a location",
    });
  }
  const location = req.query.location as string;
  const url = `http://api.weatherstack.com/current?access_key=9376141fdd275dd807c18e0c0d116220&query=${location}`;
  request({ url, json: true }, (error, response) => {
    if (error) {
      res.status(500).send({ error: "Unable to connect to weather service!" });
    } else if (response.body.error) {
      res.status(400).send({ error: "Unable to find location" });
    } else {
      res.send(response.body);
    }
  });
});
```

Para este ejercicio primero crearemos el servidor con la funcion express() y lo guardaremos en la constante app. Despues crearemos una ruta para la peticion http de tipo GET en la ruta /weather. En esta ruta primero se comprobara si se ha pasado un parametro location. En caso de que no se haya pasado un parametro location se devolvera un objeto con el atributo error a "You must provide a location". En caso de que se haya pasado un parametro location se guardara en la constante location y se creara la url para hacer la peticion http a la API de weather y se devolvera un objeto tipo JSON con la informacion del tiempo para la localizacion pasada como parametro. En caso de que no se haya podido conectar con la API de weather se devolvera un objeto con el atributo error a "Unable to connect to weather service!". En caso de que la API de weather devuelva un error se devolvera un objeto con el atributo error a "Unable to find location".

```typescript
app.get("*", (req, res) => {
  res.status(404).send({ errror: "404 - Not found" });
});
```

Además se creara una ruta para cualquier peticion http que no sea de tipo GET y se devolvera un objeto con el atributo error a "404 - Not found".

```typescript
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
```

Por ultimo se ejecutara la funcion app.listen para que el servidor empiece a escuchar peticiones http.