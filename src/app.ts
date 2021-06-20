import { readdirSync } from 'fs';
import { join } from 'path';

//import * as express from 'express';
const express = require('express');

import { checkAndChange } from './utils/functions'
import { IObject, IConfig } from './typescript/interfaces';
export class App {
	private app;
	public port: number;
	public config: IConfig;
	constructor(config: IConfig) {
		this.app = express();
		this.port = config.port;
		this.config = config
		console.log(`Starting in ${process.env.NODE_ENV} mode...`)
	}
	private handleRoutes(): void {
		readdirSync(join(__dirname, 'routes')).forEach(dir => {
			const routes = readdirSync(join(__dirname, `routes/${dir}`)).filter(file => file.endsWith('.js'))
			for (const file of routes) {
				const getFileName = require(join(__dirname, `routes/${dir}/${file}`))
				this.app.use(`/api/v${getFileName.infos.version}/${getFileName.infos.route}`, getFileName.infos.router)
				console.log(`Route chargée : /api/v${getFileName.infos.version}/${getFileName.infos.route}`);
			}
		})
	}
	private handleMiddlewares(): void {
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());
		const ALLOWED_DOMAINS = this.config.ALLOWED_DOMAINS
		this.app.use(function (req: IObject, res: IObject, next: Function) {
			const origin = req.headers.origin;
			if (ALLOWED_DOMAINS.includes(origin)) {
				res.setHeader('Access-Control-Allow-Origin', origin)
			}
			res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
			res.setHeader('Access-Control-Allow-Credentials', 'true')
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			next()
		})
		if (!this.config.production) {
			const morgan = require('morgan')('dev');
			this.app.use(morgan)
		}
	}
	public start(): void {
		this.handleMiddlewares();
		this.handleRoutes();

		this.app.use('/static', express.static(join(__dirname, '../public')));

		this.app.listen(this.port, () => {
			console.log(`Started on port ${this.port}`)
		})
		this.app.all('*', (req: IObject, res: IObject) => {
			res.status(404).json(checkAndChange(new Error("404 not found")))
		})
	}
}