const request = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');

const extractJson = /(\{.*\})/;
const fieldsToReParse = [
  'attacks',
  'languages',
  'cantrips',
  'class_features_and_traits',
  'race_features_and_traits',
  'other_proficiencies'
];

function getCharacterByCampaignAndName(campaign, name) {
  const url = `https://${campaign}.obsidianportal.com/characters/${name}`;
  const extractData = (html) => {
    const $ = cheerio.load(html);
    const script = $('.ds_basic5e > script');

    // eslint-disable-next-line
    const characterData = eval(script.contents());

    return extractJson.exec(characterData)[0];
  };
  const correctData = (parsedData) => {
    const keysToPick = _.pullAll(_.keys(parsedData), fieldsToReParse);
    const characterData = _.pick(parsedData, keysToPick);

    _.forEach(fieldsToReParse, (field) => {
      characterData[field] = JSON.parse(parsedData[field]);
    });
    return characterData;
  };

  return request(url)
    .then(extractData)
    .then(JSON.parse)
    .then(correctData);
}

module.exports = {
  get: getCharacterByCampaignAndName
};
