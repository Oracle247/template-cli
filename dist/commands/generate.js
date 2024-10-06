"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fileUtils_1 = require("../utils/fileUtils");
const templateUtils_1 = require("../utils/templateUtils");
const createModule = (moduleName) => {
    const baseDir = path_1.default.join(process.cwd(), 'src/modules', moduleName.toLowerCase());
    const structure = [
        { dir: 'services', file: `${moduleName}.service.ts`, template: 'service.ts' },
        { dir: 'controllers', file: `${moduleName}.controller.ts`, template: 'controller.ts' },
        { dir: 'models', file: `${moduleName}.model.ts`, template: 'model.ts' },
        { dir: 'interfaces', file: `${moduleName}.interface.ts`, template: 'interface.ts' },
        { dir: 'routes', file: `${moduleName}.routes.ts`, template: 'routes.ts' },
    ];
    const exportsMap = {};
    structure.forEach(({ dir, file, template }) => {
        const dirPath = path_1.default.join(baseDir, dir);
        (0, fileUtils_1.ensureDirSync)(dirPath);
        const templateContent = (0, templateUtils_1.readTemplate)(template);
        let fileContent = templateContent.replace(/__MODULE__/g, moduleName);
        fileContent = fileContent.replace(/__module__/g, moduleName.toLowerCase());
        // Remove the first line (`// @ts-nocheck`)
        const fileContentLines = fileContent.split('\n');
        fileContentLines.shift();
        fileContent = fileContentLines.join('\n');
        (0, fileUtils_1.writeFileSync)(path_1.default.join(dirPath, file), fileContent);
        console.log(`Created ${file} in ${dir}`);
        // Prepare the export statement for the index file
        const exportStatement = `export * from './${file.replace('.ts', '')}';`;
        if (!exportsMap[dir]) {
            exportsMap[dir] = [];
        }
        exportsMap[dir].push(exportStatement);
    });
    // Create the index.ts file in each directory
    for (const dir in exportsMap) {
        const indexFilePath = path_1.default.join(baseDir, dir, 'index.ts');
        const indexContent = exportsMap[dir].join('\n'); // Join only the exports for the specific directory
        (0, fileUtils_1.writeFileSync)(indexFilePath, indexContent);
        console.log(`Created index.ts in ${dir}`);
    }
    console.log(`Module ${moduleName} has been generated successfully.`);
};
exports.default = createModule;
