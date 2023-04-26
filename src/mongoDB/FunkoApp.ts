import * as fs from "fs";
import { Funko } from "./datatype/Funko.js";
import { Tipos, Genero } from "./datatype/Tipos.js";
import * as path from "path";

export type ParejamyidFunko = {
  myid: number;
  funko: Funko;
};

/**
 * Clase App
 */
export class App {
  private Usuario: string;
  private Funkos: ParejamyidFunko[] = [];

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
        this.Funkos.push({ myid: funko.myid, funko: funko });
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
      if (!fs.existsSync("./data/" + this.Usuario + "/" + funko.myid + ".json")) {
        fs.writeFileSync(
          "./data/" + this.Usuario + "/" + funko.myid + ".json",
          JSON.stringify(funko)
        );
      }
    });
    return true;
  }

  /**
   * funcion para obtener un funko
   * @param myid myid del funko
   * @returns devuelve el funko con el myid indicado
   */
  public getFunko(myid: number): Funko | undefined {
    const funko = this.Funkos.find((funko) => funko.myid == myid);
    if (funko) {
      return funko.funko;
    } else {
      return undefined;
    }
  }

  /**
   * funcion para añadir un funko
   * @param user usuario
   * @param myid myid del funko
   * @param name nombre del funko
   * @param description descripcion del funko
   * @param Tipo tipo del funko
   * @param Genero genero del funko
   * @param Franquicia franquicia del funko
   * @param Numero_franquicia numero de la franquicia del funko
   * @param Exclusivo exclusivo del funko
   * @param Caracteristicas_especiales caracteristicas especiales del funko
   * @param Precio precio del funko
   * @returns devuelve true si se ha añadmyido correctamente
   */
  public addFunko(
    user: string,
    myid: number,
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
      if (funko.myid == myid) {
        existe = true;
      }
    });

    if (!existe) {
      const funko = new Funko(
        myid,
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
      const ruta: string = "./data/" + user + "/" + myid + ".json";
      fs.writeFileSync(ruta, JSON.stringify(funko));
      return true;
    } else {
      return false;
    }
  }

  /**
   * funcion para modificar un funko
   * @param myid myid del funko
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
    myid: number,
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
      if (funko.myid == myid) {
        existe = true;
      }
    });

    if (existe) {
      const funko = new Funko(
        myid,
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
      const ruta: string = "./data/" + this.Usuario + "/" + myid + ".json";
      fs.writeFileSync(ruta, JSON.stringify(funko));
      return true;
    } else {
      return false;
    }
  }

  /**
   * funcion para eliminar un funko
   * @param myid myid del funko
   * @returns devuelve true si se ha eliminado correctamente
   */
  public removeFunko(myid: number): boolean {
    let existe = false;
    this.Funkos.forEach((funko) => {
      if (funko.myid == myid) {
        existe = true;
      }
    });

    if (existe) {
      fs.unlinkSync("./data/" + this.Usuario + "/" + myid + ".json");
      this.Funkos.forEach((funko) => {
        if (funko.myid == myid) {
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
   * funcion para mostrar un funko por su myid
   * @param myid myid del funko
   * @returns devuelve true si se ha mostrado correctamente
   */
  public showFunkoBymyid(myid: number): Funko | undefined {
    let existe = false;
    this.Funkos.forEach((funko) => {
      if (funko.myid == myid) {
        existe = true;
      }
    });

    if (existe) {
      const funko = this.Funkos.find((funko) => funko.myid == myid);
      if (funko !== undefined) {
        return funko.funko;
      }
    }
    return undefined;
  }
}
