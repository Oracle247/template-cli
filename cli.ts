#!/usr/bin/env node

import { Command } from 'commander';
import createModule from './src/commands/generate';
import { scaffoldBaseTemplate } from './src/commands/init';

const program = new Command();

program.version('1.0.0');

// Command to initialize base template
program
    .command('init <projectName>')
    .description('Initialize a new project template')
    .action((projectName: string) => {
        scaffoldBaseTemplate(projectName);
    });

// Command to generate module
program
    .command('generate <module>')
    .description('Generate a new module')
    .action((module: string) => {
        createModule(module);
    });

program.parse(process.argv);
