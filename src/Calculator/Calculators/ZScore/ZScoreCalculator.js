import {CalculatorTools} from '../../Calculator.js';
import {WHOResource} from '../../../Resource/WHOResource.js';
class ZScoreCalculator{
    constructor(patient){
        this.patient = patient;
    }
    calculateHeightForAge(){
        const whoDocumentPath = CalculatorTools.retrieveWHODocumentPath(this.patient.getSex(), this.patient.getYearsAge(), "ZScore", "HeightForAge");
        const whoResource = WHOResource.new(whoDocumentPath);
        return whoResource.matchCategory(this.patient.getWeeksAge(), this.patient.getHeight())
    }
    calculateWeightForAge(){
        const whoDocumentPath = CalculatorTools.retrieveWHODocumentPath(this.patient.getSex(), this.patient.getYearsAge(), "ZScore", "WeightForAge");
        const whoResource = WHOResource.new(whoDocumentPath);
        return whoResource.matchCategory(this.patient.getWeeksAge(), this.patient.getWeight())
    }
    calculateWeightForHeight(){
        const whoDocumentPath = CalculatorTools.retrieveWHODocumentPath(this.patient.getSex(), this.patient.getYearsAge(), "ZScore", "WeightForHeight");
        const whoResource = WHOResource.new(whoDocumentPath);
        return whoResource.matchCategory(this.patient.getHeight(), this.patient.getWeight())
    }
    calculateBMIForAge(){
        const whoDocumentPath = CalculatorTools.retrieveWHODocumentPath(this.patient.getSex(), this.patient.getYearsAge(), "ZScore", "BMIForAge");
        const whoResource = WHOResource.new(whoDocumentPath);
        return whoResource.matchCategory(this.patient.getMonthsAge(), this.patient.getHeight())
    }

    static init(patient){
        return new ZScoreCalculator(patient);
    }
}

export {ZScoreCalculator};