const request = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');

const extractJson = /(\{.*\})/;
const fieldsToReParse = [
  'attacks',
  'cantrips',
  'class_features_and_traits',
  'languages',
  'other_proficiencies',
  'race_features_and_traits'
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
      if (parsedData[field]) {
        characterData[field] = JSON.parse(parsedData[field]);
      } else {
        characterData[field] = [];
      }
    });

    // Equipment is special as it's been already laid out
    // for the view layer.
    if (parsedData.equipment) {
      const rawItems = _.flattenDeep(_.values(JSON.parse(parsedData.equipment)));
      characterData.equipment = _.map(rawItems, _.property('name'));
    } else {
      characterData.equipment = [];
    }

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
