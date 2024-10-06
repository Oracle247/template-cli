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
exports.agenda = void 0;
const config_1 = require("../../config");
const agenda_1 = require("@hokify/agenda");
const logger_1 = require("./logger");
const agenda = new agenda_1.Agenda({
    db: {
        address: config_1.DB_URI,
        collection: 'cron-jobs',
    }
});
exports.agenda = agenda;
agenda.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    // agenda.define('welcomeMessag', () => {
    //   console.log('Sending a welcome message every few seconds');
    // });
    yield Promise.all([
        yield agenda.start(),
        // await agenda.every('5 seconds', 'welcomeMessag');
        agenda.purge()
    ]);
    logger_1.logger.info('Agenda Cron Ready ✔');
}));
agenda.on('start', () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Agenda Cron Started ✔');
}));
const completed = () => __awaiter(void 0, void 0, void 0, function* () {
    yield agenda.stop();
    logger_1.logger.info('Agenda Cron Stopped ✔');
    process.exit(0);
});
process.on('SIGTERM', completed);
process.on('SIGINT', completed);
