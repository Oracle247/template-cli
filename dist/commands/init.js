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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldBaseTemplate = void 0;
const child_process_1 = require("child_process");
const fileUtils_1 = require("../utils/fileUtils");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const scaffoldBaseTemplate = (projectName) => __awaiter(void 0, void 0, void 0, function* () {
    const baseDir = path_1.default.join(process.cwd(), projectName);
    const templateDir = path_1.default.join(__dirname, '../templates/base');
    // Ensure the project directory exists
    (0, fileUtils_1.ensureDirSync)(baseDir);
    // Copy the base template to the new project directory
    try {
        fs_extra_1.default.copySync(templateDir, baseDir);
        console.log(`Project ${projectName} has been initialized with the base template.`);
    }
    catch (error) {
        console.error(`Error copying template: ${error.message}`);
        return;
    }
    // const answers = await promptUserForConfiguration();
    // customizeProject(baseDir, answers);
    //TODO: add option for either yarn, pnpm or any other package manager
    console.log('Installing dependencies...');
    try {
        (0, child_process_1.execSync)('npm install', { cwd: baseDir, stdio: 'inherit' });
        console.log('Dependencies installed successfully.');
    }
    catch (error) {
        console.error('Error installing dependencies:', error.message);
    }
});
exports.scaffoldBaseTemplate = scaffoldBaseTemplate;
const promptUserForConfiguration = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'useExpress',
            message: 'Would you like to include Express?',
            default: true,
        },
        {
            type: 'confirm',
            name: 'useMongoose',
            message: 'Would you like to include Mongoose?',
            default: false,
        },
        {
            type: 'confirm',
            name: 'includeAuth',
            message: 'Would you like to include authentication?',
            default: false,
        },
    ]);
});
const customizeProject = (baseDir, answers) => {
    if (answers.useExpress) {
        // If Express is included, modify the appropriate files
        const appFilePath = path_1.default.join(baseDir, 'app.ts');
        let appFileContent = fs_extra_1.default.readFileSync(appFilePath, 'utf-8');
        // Insert Express-related middleware or configurations here
        appFileContent = appFileContent.replace('__EXPRESS_MIDDLEWARE__', 'app.use(express.json());');
        fs_extra_1.default.writeFileSync(appFilePath, appFileContent);
        console.log('Express middleware added to app.ts');
    }
    if (answers.useMongoose) {
        // If Mongoose is included, modify the appropriate files
        const dbConfigPath = path_1.default.join(baseDir, 'config', 'db.config.ts');
        let dbConfigContent = fs_extra_1.default.readFileSync(dbConfigPath, 'utf-8');
        // Insert Mongoose connection logic here
        dbConfigContent = dbConfigContent.replace('__MONGOOSE_CONNECTION__', 'mongoose.connect(DB_URI);');
        fs_extra_1.default.writeFileSync(dbConfigPath, dbConfigContent);
        console.log('Mongoose connection logic added to db.config.ts');
    }
    if (answers.includeAuth) {
        // If authentication is included, modify the appropriate files
        const authFilePath = path_1.default.join(baseDir, 'components', 'auth.ts');
        const authContent = `
      import jwt from 'jsonwebtoken';

      export const verifyToken = (token: string) => {
        return jwt.verify(token, 'your_secret_key');
      };
    `;
        fs_extra_1.default.writeFileSync(authFilePath, authContent);
        console.log('Authentication logic added to components/auth.ts');
    }
};
