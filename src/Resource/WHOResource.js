import XLSX from 'xlsx';

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
        }

        const plotBasedOnMainIdentifier = () => {
            const mainIdentifierValues = dataObject.slice(1).map(row => {
                return row[0];
            })
            const mainIdentifierRelations = mainIdentifierValues.map((mainIdentifierValue, mainIdentifierIndex) => {
                return {
                    value: mainIdentifierValue,
                    min: (() => {
                        if ((mainIdentifierIndex - 1) < 0){
                            return -Infinity;
                        }else{
                            return mainIdentifierValue
                        }
                    })(),
                    max: (() => {
                        if ((mainIdentifierIndex + 1 ) == mainIdentifierValues.length){
                            return Infinity;
                        }else{
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
                                    }else{
                                        return dependentValue
                                    }
                                })(),
                                max: (() => {
                                    if ((dependentValueIndex + 1 ) == dependentValuesForMainIdentifier.length){
                                        return Infinity;
                                    }else{
                                        return dependentValuesForMainIdentifier[dependentValueIndex + 1] - 0.001;
                                    }
                                })(),
                                category: dependentCategory
                            }
                        })
                        return response;
                    })()
                }
            })

            return mainIdentifierRelations
        }

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
            }else{
                if (mainIdentifierValue >= item.min && mainIdentifierValue <= item.max){
                    foundMainIdentifier = item;
                }
            }
        })

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
            }else{
                if (dependentValue >= item.min && dependentValue <= item.max){
                    foundCategory = item;
                }
            }
        })

        if (!foundCategory){
            throw new Error(`Could not match a category for the value "${dependentValue}"`);
        }

        return foundCategory.category;
    }


    static new(documentPath){
        return new WHOResource(documentPath);
    }
}


export {WHOResource}