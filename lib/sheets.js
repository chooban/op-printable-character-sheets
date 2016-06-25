const _ = require('lodash');

const basicSheet = require('./single-page-sheet');

const availableSheets = {
  'basic-sheet': basicSheet
};

const extractorForFieldMap = (fieldMap) => {
  const fieldsToExtract = _.pickBy(fieldMap, _.negate(_.isNull));

  return (data) => {
    const generateField = (f) => {
      if (_.isFunction(f)) return f(data);

      return data[f];
    };

    return _.mapValues(fieldsToExtract, generateField);
  };
};

const get = (sheetId) => {
  if (!_.keys(availableSheets).includes(sheetId)) {
    throw new Error(`Unknown sheet ID: ${sheetId}`);
  }
  const sheet = availableSheets[sheetId];
  return {
    filename: sheet.filename,
    extractor: extractorForFieldMap(sheet.fieldMap)
  };
};

module.exports = {
  get,
  list: () => _.keys(availableSheets)
};
