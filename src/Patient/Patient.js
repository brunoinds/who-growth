import { Toolbox } from '../Tools/Toolbox.js';
import {CalculatorTools} from '../Calculator/Calculator.js';

const PatientSex = {
    Male: "Male",
    Female: "Female"
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

export {Patient, PatientSex};