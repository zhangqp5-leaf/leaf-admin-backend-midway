const { camelCase } = require('lodash');

export const snakeCaseToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => snakeCaseToCamelCase(item));
  }
  if (typeof obj === 'object' && obj !== null && !(obj instanceof Date)) {
    const newObj = {};
    
    for (const key in obj) {
      const camelCaseKey = camelCase(key);
      newObj[camelCaseKey] = snakeCaseToCamelCase(obj[key]);
    }
    
    return newObj;
  }
  
  return obj;
};