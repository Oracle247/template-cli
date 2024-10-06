import path from 'path';
import fs from 'fs-extra';

export const readTemplate = (templateName: string): string => {
    const templatePath = path.join(__dirname, '../templates/module', templateName);
    return fs.readFileSync(templatePath, 'utf-8');
};
