"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideo = void 0;
const path_1 = require("path");
const functions_1 = require("../utils/functions");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
function getVideo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.params.video.match(/^[a-z0-9-_ ]+\.(mp4|mov)$/i))
            return res.json(functions_1.error('Video param is invalid.'));
        const video = req.params.video;
        res.type(path_1.extname(video));
        const range = req.headers.range;
        const videoPath = path_1.join(__dirname, `../../assets/videos/${video}`);
        if (!range) {
            res.type(path_1.extname(video));
            const readStream = fs_1.createReadStream(videoPath);
            readStream.on('data', (data) => {
                res.write(data);
            });
            readStream.on('end', () => {
                return res.send();
            });
        }
        const parts = range === null || range === void 0 ? void 0 : range.replace('bytes=', '').split('-');
        const videoStats = yield promises_1.stat(videoPath);
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoStats.size - 1;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${videoStats.size}`);
        res.setHeader('Accept-Range', `bytes`);
        res.setHeader('Content-Length', (end - (start + 1)));
        res.status(206);
        const readStream = fs_1.createReadStream(videoPath, { start, end });
        readStream.pipe(res);
        // readStream.on('data', (data) => {
        // 	console.log(data);
        // 	res.write(data);
        // });
        // readStream.on('end', () => {
        // 	return res.send()
        // })
    });
}
exports.getVideo = getVideo;
// Imagine Dragons.mp4
