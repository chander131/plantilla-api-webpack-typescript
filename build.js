/********************************************************
 *    Daniel Elías SCRIPT DE GENERACIÓN DE RELEASE      *
 *                Fecha:13/02/2021                      *
 *******************************************************/

const fs = require("fs");
const path = require("path");
const util = require("util");

const exec = util.promisify(require("child_process").exec);
const DIR_ACTUAL = process.cwd();
const DIR_DIST = "dist";
const SO = process.platform;

/**
 * @function main - punto de entrada para la generación del build de producción|test|desarrollo
 * @returns {void}
 */
const main = async () => {
  console.log("Se inicia el proceso de generación del proyecto.");
  console.log("Leyendo package.json");

  const package = getPackage();

  console.log("Compilando: ", package.name);
  console.log("Versión: ", package.version);
  console.log("Sistema operativo host: ", SO);
  console.log("Verificando ambiente.");

  const typeModeBuild = getModo();
  
  console.log("Compilando para: ", typeModeBuild);

  console.log("Iniciando el compilado del código en React.JS ...");
  let { stderr:stderrReact } = await setBuildReact(typeModeBuild);

  console.log("Validando carpeta dist");
  const pathDist = getPathDist();

  console.log("dist: ", pathDist);
  
  console.log("Generando package.json del compilado");
  setPackage(pathDist, package);
  console.log("El archivo package.json fue creado correctamente");

  console.log("Creando sub directorios");
  setSubDirectorios(pathDist);
  console.log("Sub directorios creados correctamente");

  console.log("Iniciando el compilado del código en TypeScript ...");
  let { stderr:errorBuildNode } = await setBuildNode();
  // let stderr = false;
  // let errorBuildNode = false;

  console.log("El proceso de compilación termino");

  if (!stderrReact && !errorBuildNode) console.log("Compilación sin error");
  else {
    console.log(stderrReact);
    console.log(errorBuildNode);
    if (evalError(stderrReact)) return;
    else console.log("El error es por falta de actualizacion de librerias pero no es critico ni afecta la compilacion");
  }

  console.log("Se inicia el proceso de copiado de archivo");
  await setCopiar();

  console.log("Finaliza el proceso de copiado.");
  console.log(`Se finaliza el proceso de compilación, la carpeta de salida es: ${pathDist}`);
};

const getPackage = () => JSON.parse(fs.readFileSync(path.resolve(DIR_ACTUAL, "package.json"), "utf8"));

const getModo = () => {
  const typesMod = ["dev", "production", "test"];
  const arg = process.argv;
  const indiceTipoModo = arg.findIndex((variable) => (variable.indexOf("modo") > -1));

  if (indiceTipoModo < 0) {
    console.log("Faltan argumentos: \"modo\"=[dev|production|test]");
    return;
  }

  const variableBuild = arg[indiceTipoModo];

  if (variableBuild.indexOf("=") < 0) {
    console.log("Falta valor de argumento: \"modo\"");
    return;
  }

  const modoBuild = variableBuild.split("=")[1];

  if (!typesMod.includes(modoBuild)) {
    console.log("Modo invalido");
    return;
  }

  return modoBuild;
};

const deleteFolderRecursive = (pathDelete) => {
  if (fs.existsSync(pathDelete)) {
    fs.readdirSync(pathDelete).forEach((file) => {
      const pathInDir = path.resolve(pathDelete, file);
      if (fs.lstatSync(pathInDir).isDirectory()) {
        deleteFolderRecursive(pathInDir);
      } else {
        fs.unlinkSync(pathInDir);
      }
    });

    fs.rmdirSync(pathDelete);
  }
};

const getPathDist = () => {
  const pathDirOut = path.resolve(DIR_ACTUAL, DIR_DIST);

  if (fs.existsSync(pathDirOut)) deleteFolderRecursive(pathDirOut);

  fs.mkdirSync(pathDirOut);
  
  return pathDirOut;
};

const setPackage = (pathDist, package) => {
  const packageBuild = {
    name          : package.name,
    version       : package.version,
    description   : package.description,
    main          : package.main,
    scripts       : {
                      start : package.scripts.start,
                    },
    keywords      : package.keywords,
    author        : package.author,
    license       : package.license,
    dependencies  : package.dependencies,
  };

  fs.writeFileSync(path.resolve(pathDist, "package.json"), JSON.stringify(packageBuild));
};

const setSubDirectorios = (pathDist) => {
  // fs.mkdirSync(path.resolve(pathDist, "app"));
  // fs.mkdirSync(path.resolve(pathDist, "app", "constants"));
  // fs.mkdirSync(path.resolve(pathDist, "app", "functions"));
  // fs.mkdirSync(path.resolve(pathDist, "app", "helpers"));
  // fs.mkdirSync(path.resolve(pathDist, "app", "hooks"));

  fs.mkdirSync(path.resolve(pathDist, "server"));
  // fs.mkdirSync(path.resolve(pathDist, "server", "controllers"));
  // fs.mkdirSync(path.resolve(pathDist, "server", "db"));
  // fs.mkdirSync(path.resolve(pathDist, "server", "helpers"));
  // fs.mkdirSync(path.resolve(pathDist, "server", "middlewares"));
  // fs.mkdirSync(path.resolve(pathDist, "server", "models"));
  // fs.mkdirSync(path.resolve(pathDist, "server", "routes"));
  // fs.mkdirSync(path.resolve(pathDist, "server", "services"));

  fs.mkdirSync(path.resolve(pathDist, "server", "public"));
  fs.mkdirSync(path.resolve(pathDist, "server", "public", "contents"));
  fs.mkdirSync(path.resolve(pathDist, "server", "public", "fonts"));
  fs.mkdirSync(path.resolve(pathDist, "server", "public", "images"));
  fs.mkdirSync(path.resolve(pathDist, "server", "public", "scripts"));
};

const setBuildNode = async () => {
  const { stdout, stderr } = await exec(`tsc`);
  
  console.log(stdout);

  if (stderr) console.log("Ocurrió un error en la compilación typeScript.");
  return { stdout, stderr };
};

const setBuildReact = async (modo) => {
  let ambiente = modo;

  if (modo == "dev") ambiente = "development";

  const { stdout, stderr } = await exec(`webpack --mode ${ambiente}`);
  
  console.log(stdout);

  if (stderr) console.log("Ocurrió un error en la compilación.");

  return { stdout, stderr };
};

const evalError = (err) => (err.indexOf("npm update") < 0);

const setCopiar = async () => {
  if (SO === "win32") {
    const { stdout, stderr } = await exec("pro.copyrelease.bat");

    console.log(stdout);

    if (stderr) console.log("Ocurrió un error en el copiado de archivos.");

    return { stdout, stderr };
  } else {
    const msj = "Actualmente este sistema no está soportado.";
    console.log(msj, SO);

    return { stdout: "", stderr: msj };
  }
};

main();
 