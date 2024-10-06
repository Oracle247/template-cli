#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generate_1 = __importDefault(require("./commands/generate"));
const init_1 = require("./commands/init");
const program = new commander_1.Command();
program.version('1.0.0');
// Command to initialize base template
program
    .command('init <projectName>')
    .description('Initialize a new project template')
    .action((projectName) => {
    (0, init_1.scaffoldBaseTemplate)(projectName);
});
// Command to generate module
program
    .command('generate <module>')
    .description('Generate a new module')
    .action((module) => {
    (0, generate_1.default)(module);
});
program.parse(process.argv);
