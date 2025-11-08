import bcrypt from 'bcrypt';
import {fileURLToPath} from 'url';
import { dirname } from 'path';

export const createHash = async(password) =>{
    const sales = await bcrypt.genSalt(10);
    return bcrypt.hash(password,sales);
}

export const passwordValidation = async(usuario,password) => bcrypt.compare(password,usuario.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;