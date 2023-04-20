import * as fs from "fs";
import { Funko } from "./datatype/Funko.js";
import { Tipos, Genero } from "./datatype/Tipos.js";
import * as path from "path";

export type ParejaIDFunko = {
  id: number;
  funko: Funko;
};

/**
 * Clase App
 */
export class App {
  private Usuario: string;
  private Funkos: ParejaIDFunko[] = [];

  /**
   * constructor de la clase App
   * @param user nombre del usuario
   */
  constructor(user: string) {
    this.Usuario = user;
  }

  /**
   * funcion para cargar los datos de un usuario
   * @param user nombre del usuario
   * @returns devuelve true si se ha cargado correctamente
   */
  public cargarDatos(user: string): boolean {
    const carpeta: string = "./data/" + user + "/";
    if (!fs.existsSync(carpeta)) {
      fs.mkdirSync("./data/" + user);
    }
    const archivos = fs.readdirSync(carpeta);

    if (archivos.length == 0) {
      return false;
    } else {
      archivos.forEach((archivo) => {
        const ruta: string = path.join(carpeta, archivo);
        const funko: Funko = JSON.parse(fs.readFileSync(ruta, "utf-8"));
        this.Funkos.push({ id: funko.id, funko: funko });
      });
    }
    return true;
  }

  /**
   * funcion para guardar los datos de un usuario
   * @returns devuelve true si se ha guardado correctamente
   */
  public guardarDatos(): boolean {
    this.Funkos.forEach((funko) => {
      if (!fs.existsSync("./data/" + this.Usuario + "/" + funko.id + ".json")) {
        fs.writeFileSync(
          "./data/" + this.Usuario + "/" + funko.id + ".json",
          JSON.stringify(funko)
        );
      }
    });
    return true;
  }

  /**
   * funcion para obtener un funko
   * @param id id del funko
   * @returns devuelve el funko con el id indicado
   */
  public getFunko(id: number): Funko | undefined {
    const funko = this.Funkos.find((funko) => funko.id == id);
    if (funko) {
      return funko.funko;
    } else {
      return undefined;
    }
  }

  /**
   * funcion para añadir un funko
   * @param user usuario
   * @param id id del funko
   * @param name nombre del funko
   * @param description descripcion del funko
   * @param Tipo tipo del funko
   * @param Genero genero del funko
   * @param Franquicia franquicia del funko
   * @param Numero_franquicia numero de la franquicia del funko
   * @param Exclusivo exclusivo del funko
   * @param Caracteristicas_especiales caracteristicas especiales del funko
   * @param Precio precio del funko
   * @returns devuelve true si se ha añadido correctamente
   */
  public addFunko(
    user: string,
    id: number,
    name: string,
    description: string,
    Tipo: Tipos,
    Genero: Genero,
    Franquicia: string,
    Numero_franquicia: number,
    Exclusivo: boolean,
    Caracteristicas_especiales: string,
    Precio: number
  ): boolean {
    let existe = false;
    this.Funkos.forEach((funko) => {
      if (funko.id == id) {
        existe = true;
      }
    });

    if (!existe) {
      const funko = new Funko(
        id,
        name,
        description,
        Tipo,
        Genero,
        Franquicia,
        Numero_franquicia,
        Exclusivo,
        Caracteristicas_especiales,
        Precio
      );
      const ruta: string = "./data/" + user + "/" + id + ".json";
      fs.writeFileSync(ruta, JSON.stringify(funko));
      return true;
    } else {
      return false;
    }
  }

  /**
   * funcion para modificar un funko
   * @param id id del funko
   * @param name nombre del funko
   * @param description descripcion del funko
   * @param Tipo tipo del funko
   * @param Genero genero del funko
   * @param Franquicia franquicia del funko
   * @param Numero_franquicia numero de la franquicia del funko
   * @param Exclusivo exclusivo del funko
   * @param Caracteristicas_especiales caracteristicas especiales del funko
   * @param Precio precio del funko
   * @returns devuelve true si se ha modificado correctamente
   */
  public modifyFunko(
    id: number,
    name: string,
    description: string,
    Tipo: Tipos,
    Genero: Genero,
    Franquicia: string,
    Numero_franquicia: number,
    Exclusivo: boolean,
    Caracteristicas_especiales: string,
    Precio: number
  ): boolean {
    let existe = false;
    this.Funkos.forEach((funko) => {
      if (funko.id == id) {
        existe = true;
      }
    });

    if (existe) {
      const funko = new Funko(
        id,
        name,
        description,
        Tipo,
        Genero,
        Franquicia,
        Numero_franquicia,
        Exclusivo,
        Caracteristicas_especiales,
        Precio
      );
      const ruta: string = "./data/" + this.Usuario + "/" + id + ".json";
      fs.writeFileSync(ruta, JSON.stringify(funko));
      return true;
    } else {
      return false;
    }
  }

  /**
   * funcion para eliminar un funko
   * @param id id del funko
   * @returns devuelve true si se ha eliminado correctamente
   */
  public removeFunko(id: number): boolean {
    let existe = false;
    this.Funkos.forEach((funko) => {
      if (funko.id == id) {
        existe = true;
      }
    });

    if (existe) {
      fs.unlinkSync("./data/" + this.Usuario + "/" + id + ".json");
      this.Funkos.forEach((funko) => {
        if (funko.id == id) {
          this.Funkos.splice(this.Funkos.indexOf(funko), 1);
        }
      });

      return true;
    }
    return false;
  }

  /**
   * funcion para listar los funkos
   * @returns devuelve true si se ha listado correctamente
   */
  public listFunkos(): Funko[] {
    const funkos: Funko[] = [];
    this.Funkos.forEach((funko) => {
      funkos.push(funko.funko);
    });
    return funkos;
  }

  /**
   * funcion para mostrar un funko por su id
   * @param id id del funko
   * @returns devuelve true si se ha mostrado correctamente
   */
  public showFunkoById(id: number): Funko | undefined {
    let existe = false;
    this.Funkos.forEach((funko) => {
      if (funko.id == id) {
        existe = true;
      }
    });

    if (existe) {
      const funko = this.Funkos.find((funko) => funko.id == id);
      if (funko !== undefined) {
        return funko.funko;
      }
    }
    return undefined;
  }
}
