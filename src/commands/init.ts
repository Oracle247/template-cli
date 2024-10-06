import { execSync } from 'child_process';
import { ensureDirSync } from '../utils/fileUtils';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

export const scaffoldBaseTemplate = async (projectName: string): Promise<void> => {
  const baseDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, '../templates/base');

  // Ensure the project directory exists
  ensureDirSync(baseDir);

  // Copy the base template to the new project directory
  try {
    fs.copySync(templateDir, baseDir);
    console.log(`Project ${projectName} has been initialized with the base template.`);
  } catch (error: any) {
    console.error(`Error copying template: ${error.message}`);
    return;
  }

  // const answers = await promptUserForConfiguration();

  // customizeProject(baseDir, answers);

  //TODO: add option for either yarn, pnpm or any other package manager
  console.log('Installing dependencies...');
  try {
    execSync('npm install', { cwd: baseDir, stdio: 'inherit' });
    console.log('Dependencies installed successfully.');
  } catch (error: any) {
    console.error('Error installing dependencies:', error.message);
  }
};


const promptUserForConfiguration = async () => {
  return await inquirer.prompt([
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
};

const customizeProject = (baseDir: string, answers: any): void => {
  if (answers.useExpress) {
    // If Express is included, modify the appropriate files
    const appFilePath = path.join(baseDir, 'app.ts');
    let appFileContent = fs.readFileSync(appFilePath, 'utf-8');

    // Insert Express-related middleware or configurations here
    appFileContent = appFileContent.replace('__EXPRESS_MIDDLEWARE__', 'app.use(express.json());');
    fs.writeFileSync(appFilePath, appFileContent);
    console.log('Express middleware added to app.ts');
  }

  if (answers.useMongoose) {
    // If Mongoose is included, modify the appropriate files
    const dbConfigPath = path.join(baseDir, 'config', 'db.config.ts');
    let dbConfigContent = fs.readFileSync(dbConfigPath, 'utf-8');

    // Insert Mongoose connection logic here
    dbConfigContent = dbConfigContent.replace('__MONGOOSE_CONNECTION__', 'mongoose.connect(DB_URI);');
    fs.writeFileSync(dbConfigPath, dbConfigContent);
    console.log('Mongoose connection logic added to db.config.ts');
  }

  if (answers.includeAuth) {
    // If authentication is included, modify the appropriate files
    const authFilePath = path.join(baseDir, 'components', 'auth.ts');
    const authContent = `
      import jwt from 'jsonwebtoken';

      export const verifyToken = (token: string) => {
        return jwt.verify(token, 'your_secret_key');
      };
    `;
    fs.writeFileSync(authFilePath, authContent);
    console.log('Authentication logic added to components/auth.ts');
  }
};
