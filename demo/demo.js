import { Calculator } from '../src/Calculator/Calculator.js';
import { Patient } from '../src/Patient/Patient.js';

const patient = new Patient({
    name: "John Doe",
    birthDate: "2019-01-01",
    weight: 10,
    height: 0.7,
    bmi: 10,
    sex: "Male"
})

const result = Calculator.load("Percentile", patient).calculateBMIForAge();
console.log(result);