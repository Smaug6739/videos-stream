import { Router } from 'express';
import * as VideosCtrl from '../../controllers/videos';
import { Iroute } from '../../typescript/interfaces';
const VideosRouter: Router = Router();

VideosRouter.all('/:video', VideosCtrl.getVideo)


export const infos: Iroute = {
	route: "videos",
	version: 1,
	router: VideosRouter
};