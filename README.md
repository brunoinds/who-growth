# who-growth
JS library to calculate WHO child growth standards

## How to use
```javascript
import { Calculator } from './src/Calculator/Calculator.js';
import { Patient } from './src/Patient/Patient.js';

const patient = new Patient({
    name: "John Doe",
    birthDate: "2019-01-01",
    weight: 10,
    height: 0.7,
    bmi: 10,
    sex: "Male"
})

const result = Calculator.load("Percentile", patient).calculateBMIForAge();
//Return "P1"
```
### Step-by-step:
1. Instantiate a new Patient
The Patient should have `name, birthDate, weight, height, sex`. Those date are required and needed to calculate the WHO data. You can see more about the Patient Class on the documentation bellow.

```javascript
import { Patient } from './src/Patient/Patient.js';

const patient = new Patient({
    name: "John Doe",
    birthDate: "2019-01-01",
    weight: 10,
    height: 0.7,
    sex: "Male"
})
```
2. Choose a Calculator
Once you already have the patient, you need to choose a Calculator in order to retrieve the desired result. There is two types of calculators: `ZScore` and `Percentile`. To instantiate a Calculator, you have to pass the type of the calculator and the Patient.
For example: you want to get the Weight-for-Height ZScore for a patient:

```javascript
import { Calculator } from './src/Calculator/Calculator.js';
const patient = new Patient({
    name: "John Doe",
    birthDate: "2019-01-01",
    weight: 10,
    height: 0.7,
    sex: "Male"
})

//Instantiate a ZScore calculator
const patientCalculator = Calculator.load("ZScore", patient);

//Perform calculation
const result = patientCalculator.calculateWeightForHeight();
```
3. Done!

## How to Install

## Use cases
1. Calculate the WHO child growth Percentile and Z-Score based on the WHO website data


## User Guide

### Available Calculators Types
* Z-Score
* Percentile
### Available Calculators Operations
* Weight-for-Age
* Height/Length-for-Age
* Weight-for-Height/Length
* BMI-for-Age




## Documentation
### Patient [Class]
### Calculator [Class]

## Resources
The WHO resources of this project is from the official WHO page (https://www.who.int/tools/child-growth-standards/standards). The values is available in the XLSX format and this project uses it on the `resources/WHODocuments` folder.

## Contributions
Feel free to contribute with the project. Create PR's improvements on the project!