const fs = require('fs');
const promisify = require('es6-promisify');
const fillPdf = require('fill-pdf');
const _ = require('lodash');
const CharacterService = require('./lib/character-service');
const Sheets = require('./lib/sheets');

const generatePdf = promisify(fillPdf.generatePdf);

const campaignid = 'hoardofthedragon';
const characterNames = ['cameron-du-lac'];
const sheet = Sheets.get('basic-sheet');

console.log(Sheets.list());

_.forEach(characterNames, (characterName) => {
  const generateSheet = _.partialRight(generatePdf, sheet.filename);
  const writeSheet = _.partial(fs.writeFile, characterName + '.pdf');

  CharacterService.get(campaignid, characterName)
    .then(sheet.extractor)
    .then(generateSheet)
    .then(writeSheet);
});

