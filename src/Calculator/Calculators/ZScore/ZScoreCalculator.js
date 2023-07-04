class ZScoreCalculator{
    constructor(patient){
        this.patient = patient;
    }
    calculateHeightForAge(){}
    calculatWeightForAge(){}
    calculatWeightForHeight(){}
    calculateBMIForAge(){}

    static init(patient){
        return new PercentileCalculator(patient);
    }
}

export default ZScoreCalculator;