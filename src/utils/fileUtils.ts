import fs from 'fs-extra';

export const ensureDirSync = (dir: string): void => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

export const writeFileSync = (filePath: string, content: string): void => {
    fs.writeFileSync(filePath, content);
};
