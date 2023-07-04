import fs from 'fs';
import {PercentileCalculator} from './Calculators/Percentile/PercentileCalculator.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const CalculatorTypes = {
    ZScore: "ZScore",
    Percentile: "Percentile"
}
const CalculatorNames = {
    WeightForAge: "WeightForAge",
    HeightForAge: "HeightForAge",
    WeightForHeight: "WeightForHeight",
    BMIForAge: "BMIForAge"
}
class Calculator{
    static load(type, patient){
        switch(type){
            case CalculatorTypes.ZScore:
                //return ZScoreCalculator.init(patient);
            case CalculatorTypes.Percentile:
                return PercentileCalculator.init(patient);
            default:
                throw new Error(`Invalid calculator type "${type}"`);
        }
    }
}


class CalculatorTools{
    static retrieveWHODocumentPath(sex, ageInYears, calculatorType, calculatorName){
        const whoDocumentFolder = (() => {
            switch (calculatorName){
                case CalculatorNames.WeightForAge:
                    return "weightForAge"
                    break;
                case CalculatorNames.HeightForAge:
                    return "heightForAge"
                    break;
                case CalculatorNames.WeightForHeight:
                    return "weightForHeight"
                    break;
                case CalculatorNames.BMIForAge:
                    return "bmiForAge"
                    break;
            }
        })();
        const listDocumentsWHODocuments = (whoDocumentsFolderName) => {
            const whoDocumentsFolder = fs.readdirSync(__dirname + `/../../resources/WHODocuments/${whoDocumentsFolderName}`);
            return whoDocumentsFolder;
        }
        
        const documentsBySex = listDocumentsWHODocuments(whoDocumentFolder).filter((document) => {
            if (sex == "Male"){
                return document.includes("boys");
            }else{
                return document.includes("girls");
            }
        })

        const documentsByCalculatorType = documentsBySex.filter((document) => {
            if (calculatorType == CalculatorTypes.ZScore){
                return document.includes("zscore") || document.includes("z-who");
            }else{
                return document.includes("_p_") || document.includes("perc")
            }
        })

        const documentsByAge = documentsByCalculatorType.filter((document) => {
            if (ageInYears <= 2){
                return document.includes("0-to-2") || document.includes("0_2")  || document.includes("0_5") || document.includes("0-to-5");
            }else if (ageInYears <= 5){
                return document.includes("2-to-5") || document.includes("2_5") || document.includes("0_5") || document.includes("0-to-5");
            }else if (ageInYears > 5){
                return document.includes("2007")
            }else{
                return false;
            }
        })

        if (documentsByAge.length == 0){
            throw `Could not found a WHODocument that matches the calculator requirements.`
        }

        return `${__dirname}/../../resources/WHODocuments/${whoDocumentFolder}/${documentsByAge[0]}`;
    }
}

export {CalculatorTools, CalculatorTypes, Calculator};