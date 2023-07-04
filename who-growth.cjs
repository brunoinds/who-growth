'use strict';

var fs = require('fs');
var XLSX = require('xlsx');

class WHOResource{
    constructor(documentPath){
        this.documentPath = documentPath;
        this.plot = null;
        this.categories = null;
        this.mainIdentifierName = null;

        this._load();
    }

    _load(){
        const dataObject = this.__readDocumentToObject(this.documentPath);
        const plotObject = this.__parseObjectToPlot(dataObject);
        this.plot = plotObject.plot;
        this.categories = plotObject.categories;
        this.mainIdentifierName = plotObject.identifierName;
    }
    __readDocumentToObject(documentPath){
        const workbook = XLSX.readFile(documentPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        return data;
    }
    __parseObjectToPlot(dataObject){
        const header = dataObject[0];
        const rows = dataObject.slice(1).map(row => {
            return row.slice(5)
        });
        const categories = header.slice(5);

        const getPlotInformations = () => {
            return {
                mainIdentifierName: header[0],
            }
        };

        const plotBasedOnMainIdentifier = () => {
            const mainIdentifierValues = dataObject.slice(1).map(row => {
                return row[0];
            });
            const mainIdentifierRelations = mainIdentifierValues.map((mainIdentifierValue, mainIdentifierIndex) => {
                return {
                    value: mainIdentifierValue,
                    min: (() => {
                        if ((mainIdentifierIndex - 1) < 0){
                            return -Infinity;
                        }else {
                            return mainIdentifierValue
                        }
                    })(),
                    max: (() => {
                        if ((mainIdentifierIndex + 1 ) == mainIdentifierValues.length){
                            return Infinity;
                        }else {
                            return mainIdentifierValues[mainIdentifierIndex + 1] - 0.001;
                        }
                    })(),
                    dependentValues: (() => {
                        const dependentValuesForMainIdentifier = rows[mainIdentifierIndex];
    
    
                        const response = dependentValuesForMainIdentifier.map((dependentValue, dependentValueIndex) => {
                            const dependentCategory = categories[dependentValueIndex];
    
                            return {
                                value: dependentValue,
                                min: (() => {
                                    if ((dependentValueIndex - 1) < 0){
                                        return -Infinity;
                                    }else {
                                        return dependentValue
                                    }
                                })(),
                                max: (() => {
                                    if ((dependentValueIndex + 1 ) == dependentValuesForMainIdentifier.length){
                                        return Infinity;
                                    }else {
                                        return dependentValuesForMainIdentifier[dependentValueIndex + 1] - 0.001;
                                    }
                                })(),
                                category: dependentCategory
                            }
                        });
                        return response;
                    })()
                }
            });

            return mainIdentifierRelations
        };

        const plotInfo = getPlotInformations();

        return {
            identifierName: plotInfo.mainIdentifierName,
            categories: categories,
            plot: plotBasedOnMainIdentifier()
        }
    }

    matchCategory(mainIdentifierValue, dependentValue){
        const $this = this;
        const mainIdentifierValues = $this.plot;
        let foundCategory = null;
        let foundMainIdentifier = null;
        mainIdentifierValues.forEach((item, itemIndex) => {
            if (foundMainIdentifier){
                return;
            }

            if (item.min == -Infinity){
                if (mainIdentifierValue <= item.max){
                    foundMainIdentifier = item;
                }
            }else if (item.max == Infinity){
                if (mainIdentifierValue >= item.min){
                    foundMainIdentifier = item;
                }
            }else {
                if (mainIdentifierValue >= item.min && mainIdentifierValue <= item.max){
                    foundMainIdentifier = item;
                }
            }
        });

        if (!foundMainIdentifier){
            throw new Error(`Could not match a valid value (${mainIdentifierValue}) for "${$this.mainIdentifierName}"`);
        }

        foundMainIdentifier.dependentValues.forEach((item, itemIndex) => {
            if (foundCategory){
                return;
            }

            if (item.min == -Infinity){
                if (dependentValue <= item.max){
                    foundCategory = item;
                }
            }else if (item.max == Infinity){
                if (dependentValue >= item.min){
                    foundCategory = item;
                }
            }else {
                if (dependentValue >= item.min && dependentValue <= item.max){
                    foundCategory = item;
                }
            }
        });

        if (!foundCategory){
            throw new Error(`Could not match a category for the value "${dependentValue}"`);
        }

        return foundCategory.category;
    }


    static new(documentPath){
        return new WHOResource(documentPath);
    }
}

class PercentileCalculator{
    constructor(patient){
        this.patient = patient;
    }
    calculateHeightForAge(){
        const whoDocumentPath = CalculatorTools.retrieveWHODocumentPath(this.patient.getSex(), this.patient.getYearsAge(), "Percentile", "HeightForAge");
        const whoResource = WHOResource.new(whoDocumentPath);
        return whoResource.matchCategory(this.patient.getWeeksAge(), this.patient.getHeight())
    }
    calculatWeightForAge(){
        const whoDocumentPath = CalculatorTools.retrieveWHODocumentPath(this.patient.getSex(), this.patient.getYearsAge(), "Percentile", "WeightForAge");
        const whoResource = WHOResource.new(whoDocumentPath);
        return whoResource.matchCategory(this.patient.getWeeksAge(), this.patient.getWeight())
    }
    calculatWeightForHeight(){
        const whoDocumentPath = CalculatorTools.retrieveWHODocumentPath(this.patient.getSex(), this.patient.getYearsAge(), "Percentile", "WeightForHeight");
        const whoResource = WHOResource.new(whoDocumentPath);
        return whoResource.matchCategory(this.patient.getHeight(), this.patient.getWeight())
    }
    calculateBMIForAge(){
        const whoDocumentPath = CalculatorTools.retrieveWHODocumentPath(this.patient.getSex(), this.patient.getYearsAge(), "Percentile", "BMIForAge");
        const whoResource = WHOResource.new(whoDocumentPath);
        return whoResource.matchCategory(this.patient.getMonthsAge(), this.patient.getHeight())
    }

    static init(patient){
        return new PercentileCalculator(patient);
    }
}

const CalculatorTypes = {
    ZScore: "ZScore",
    Percentile: "Percentile"
};
const CalculatorNames = {
    WeightForAge: "WeightForAge",
    HeightForAge: "HeightForAge",
    WeightForHeight: "WeightForHeight",
    BMIForAge: "BMIForAge"
};
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
                case CalculatorNames.HeightForAge:
                    return "heightForAge"
                case CalculatorNames.WeightForHeight:
                    return "weightForHeight"
                case CalculatorNames.BMIForAge:
                    return "bmiForAge"
            }
        })();
        const listDocumentsWHODocuments = (whoDocumentsFolderName) => {
            const whoDocumentsFolder = fs.readdirSync(`./resources/WHODocuments/${whoDocumentsFolderName}`);
            return whoDocumentsFolder;
        };
        
        const documentsBySex = listDocumentsWHODocuments(whoDocumentFolder).filter((document) => {
            if (sex == "Male"){
                return document.includes("boys");
            }else {
                return document.includes("girls");
            }
        });

        const documentsByCalculatorType = documentsBySex.filter((document) => {
            if (calculatorType == CalculatorTypes.ZScore){
                return document.includes("zscore") || document.includes("z-who");
            }else {
                return document.includes("_p_") || document.includes("perc")
            }
        });

        const documentsByAge = documentsByCalculatorType.filter((document) => {
            if (ageInYears <= 2){
                return document.includes("0-to-2") || document.includes("0_2")  || document.includes("0_5") || document.includes("0-to-5");
            }else if (ageInYears <= 5){
                return document.includes("2-to-5") || document.includes("2_5") || document.includes("0_5") || document.includes("0-to-5");
            }else if (ageInYears > 5){
                return document.includes("2007")
            }else {
                return false;
            }
        });

        if (documentsByAge.length == 0){
            throw `Could not found a WHODocument that matches the calculator requirements.`
        }

        return `./resources/WHODocuments/${whoDocumentFolder}/${documentsByAge[0]}`;
    }
}

class Toolbox{
    static generateID(){
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return uuid;
    }
}

class Patient{
    constructor(patientData){
        this.id = Toolbox.generateID();
        this.name = patientData.name;
        this.birthDate = patientData.birthDate;
        this.weight = patientData.weight;
        this.height = patientData.height;
        this.sex = patientData.sex;
    }
    getWeeksAge(){
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        const diffTime = Math.abs(today - birthDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return Math.floor(diffDays / 7);
    }
    getYearsAge(){
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        const diffTime = Math.abs(today - birthDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.floor(diffDays / 365);
    }
    getMonthsAge(){
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        const diffTime = Math.abs(today - birthDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.floor(diffDays / 30);
    }
    getHeight(){
        return this.height;
    }
    getWeight(){
        return this.weight;
    }
    getBMI(){
        return this.getWeight() / (this.getHeight() * this.getHeight());
    }
    getSex(){
        return this.sex;
    }

    calculate(){
        return {
            percentile: {
                heightForAge: CalculatorTools.load("Percentile", this).calculateHeightForAge,
                weightForAge: CalculatorTools.load("Percentile", this).calculateWeightForAge,
                weightForHeight: CalculatorTools.load("Percentile", this).calculateWeightForHeight,
                bmiForAge: CalculatorTools.load("Percentile", this).calculateBMIForAge
            },
            zScore: {
                heightForAge: CalculatorTools.load("ZScore", this).calculateHeightForAge,
                weightForAge: CalculatorTools.load("ZScore", this).calculateWeightForAge,
                weightForHeight: CalculatorTools.load("ZScore", this).calculateWeightForHeight,
                bmiForAge: CalculatorTools.load("ZScore", this).calculateBMIForAge
            }
        }
    }

    static new(patientData){
        return new Patient(patientData);
    }
}

module.exports = {
    Patient,
    Calculator
};