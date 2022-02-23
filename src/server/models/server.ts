import express, { Request, Response, Application, NextFunction } from 'express';
// import routesUsuario from '../routes/usuarios.routes';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';

import getPathEnv from '../helpers/validate-environment';
import injectionsEnv from '../configs/injectionsEnv';
// import db from '../db/conecction';

class Server {
	private app: Application;
	private port: string;
	// private apiPaths = {
	// 	usuarios: '/api/usuarios',
	// };

	constructor() {
		this.app = express();

		// Configuración dot.env
		dotenv.config({ path: getPathEnv(null) });
		
		this.port = process.env.PORT || '8000';
		this.conectarDB();
		this.middlewares();
		this.routes();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		this.app.use(morgan(injectionsEnv.typeMorgan));

		// Lectura del body | serializacion del body
		this.app.use(express.json());

		// Carpeta publica con archivos estaticos, si queremos agregar otras carpetas usar la misma sintaxis
		// tomar en cuenta la ruta en la que se encuentra la carpeta y desde donde se llama
		this.app.use(express.static(path.join(__dirname, "../public")));

		// A todas las respuestas les adjuntamos los siguientes encabezados
		this.app.use(function (req:Request, res:Response, next:NextFunction) {
			// Permite que la api sea accedida desde todos los origenes
			res.header("Access-Control-Allow-Origin", "*");

			// Este encabezado es usado para las peticiones previas que hace el cliente y le indicamos los
			// encabezados soportados por nuestra api, ver mas en https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});
	}

	routes() {
		// this.app.use(this.apiPaths.usuarios, routesUsuario);
		this.app.get('/', (req: Request, res: Response, next:NextFunction) => {  
			// return res.send('<html><body><h2>Congrts!!! Server Configured</h2</body></html>');
			const distPath = path.resolve("src/server/public");
			return res.sendFile(path.join(distPath, '/index.html'));
		});

		// this.app.get("*", (req: Request, res: Response) => {
		// 	res.sendFile(path.join(__dirname + "../public/index.html"));
		// });

		this.app.get('/api', (req: Request, res: Response) => {
			return res.status(200).json({ IsSuccess: true, Message: "OK", Result: null });

			// res.writeHead(301, {
			// 	Location: "https://www.google.com"
			// }).end();
			// res.redirect(301, "https://google.com");
		});
	}

	async conectarDB() {
		try {
			// await db.authenticate();
			console.log('Database online');
		} catch (e: any) {
			console.log('ERRO in model/server => conectarDB', e);
			throw new Error(e);
		}
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log('######################################');
			console.log('######################################');
			console.log(`##### SERVER RUN IN PORT => ${this.port} #####`);
			console.log('######################################');
			console.log('######################################');
		});
	}
}

export default Server;
