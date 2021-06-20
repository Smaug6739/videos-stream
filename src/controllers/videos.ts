import { join, extname } from 'path';
import { IObject } from '../typescript/interfaces';
import { error } from '../utils/functions'
import type { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
export async function getVideo(req: Request, res: Response) {
	if (!req.params.video.match(/^[a-z0-9-_ ]+\.(mp4|mov)$/i)) return res.json(error('Video param is invalid.'));
	const video = req.params.video

	res.type(extname(video))

	const range = req.headers.range
	const videoPath = join(__dirname, `../../assets/videos/${video}`)
	if (!range) {
		res.type(extname(video))
		const readStream = createReadStream(videoPath);
		readStream.on('data', (data) => {
			res.write(data);
		});
		readStream.on('end', () => {
			return res.send()
		})
	}
	const parts = range?.replace('bytes=', '').split('-');
	const videoStats = await stat(videoPath)
	const start = parseInt(parts![0], 10);
	const end = parts![1] ? parseInt(parts![1], 10) : videoStats.size - 1;
	res.setHeader('Content-Range', `bytes ${start}-${end}/${videoStats.size}`);
	res.setHeader('Accept-Range', `bytes`);
	res.setHeader('Content-Length', (end - (start + 1)))
	res.status(206)
	const readStream = createReadStream(videoPath, { start, end });
	readStream.pipe(res);
	// readStream.on('data', (data) => {
	// 	console.log(data);

	// 	res.write(data);
	// });
	// readStream.on('end', () => {
	// 	return res.send()
	// })


}
// Imagine Dragons.mp4
