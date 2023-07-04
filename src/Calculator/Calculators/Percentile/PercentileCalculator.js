import {CalculatorTools} from '../../Calculator.js';
import {WHOResource} from '../../../Resource/WHOResource.js';

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

export { PercentileCalculator };