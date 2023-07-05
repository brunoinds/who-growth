import path from 'path';
import process from 'process';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';

class Toolbox{
    static generateID(){
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return uuid;
    }
    static getExecutionType(){
        function isModule() {
            return typeof module !== 'undefined' && module.exports !== undefined;
        }
        function esMain(meta) {
            function stripExt(name) {
                const extension = path.extname(name);
                if (!extension) {
                    return name;
                }
                return name.slice(0, -extension.length);
            }
            if (!meta || !process.argv[1]) {
                return false;
            }

            const require = createRequire(meta.url);
            const scriptPath = require.resolve(process.argv[1]);
            const modulePath = fileURLToPath(meta.url);

            const extension = path.extname(scriptPath);
            if (extension) {
                return modulePath === scriptPath;
            }
            return stripExt(modulePath) === scriptPath;
        }

        if (isModule()){
            if (require.main === module) {
                return "Standalone"
            } else {
                return "Dependency"
            }
        }else{
            if (esMain(import.meta)) {
                return "Standalone"
            }else{
                return "Dependency"
            }
        }
    }
}


export {Toolbox}