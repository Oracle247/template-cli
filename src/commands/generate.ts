import path from 'path';
import { ensureDirSync, writeFileSync } from '../utils/fileUtils';
import { readTemplate } from '../utils/templateUtils';

const createModule = (moduleName: string): void => {
    const baseDir = path.join(process.cwd(), 'src/modules', moduleName);

    const structure = [
        { dir: 'services', file: `${moduleName}.service.ts`, template: 'service.ts' },
        { dir: 'controllers', file: `${moduleName}.controller.ts`, template: 'controller.ts' },
        { dir: 'models', file: `${moduleName}.model.ts`, template: 'model.ts' },
        { dir: 'interfaces', file: `${moduleName}.interface.ts`, template: 'interface.ts' },
        { dir: 'routes', file: `${moduleName}.routes.ts`, template: 'routes.ts' },
    ];

    const exportsMap: { [key: string]: string[] } = {};

    structure.forEach(({ dir, file, template }) => {
        const dirPath = path.join(baseDir, dir);
        ensureDirSync(dirPath);

        const templateContent = readTemplate(template);
        const fileContent = templateContent.replace(/__MODULE__/g, moduleName);
        writeFileSync(path.join(dirPath, file), fileContent);

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
        const indexFilePath = path.join(baseDir, dir, 'index.ts');
        const indexContent = exportsMap[dir].join('\n'); // Join only the exports for the specific directory

        writeFileSync(indexFilePath, indexContent);
        console.log(`Created index.ts in ${dir}`);
    }

    console.log(`Module ${moduleName} has been generated successfully.`);
};

export default createModule;
