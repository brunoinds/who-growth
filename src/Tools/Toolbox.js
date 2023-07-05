import esMain from 'es-main'
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