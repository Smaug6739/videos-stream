
import { IConfig } from "./typescript/interfaces";

export const config: IConfig = {
	port: 8082,
	production: false,

	domain: "localhost",
	ALLOWED_DOMAINS: ["http://localhost:3000"],
}