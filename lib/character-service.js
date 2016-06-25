const request = require('request-promise');
const cheerio = require('cheerio');

const extractJson = /(\{.*\})/;

function getCharacterByCampaignAndName(campaign, name) {
  const url = `https://${campaign}.obsidianportal.com/characters/${name}`;

  return request(url)
    .then((html) => {
      const $ = cheerio.load(html);
      const script = $('.ds_basic5e > script');

      // eslint-disable-next-line
      const characterData = eval(script.contents());

      const rawData = extractJson.exec(characterData)[0];
      const parsedData = JSON.parse(rawData);
      parsedData.attacks = JSON.parse(parsedData.attacks);
      parsedData.languages = JSON.parse(parsedData.languages);
      parsedData.cantrips = JSON.parse(parsedData.cantrips);
      parsedData.class_features_and_traits = JSON.parse(parsedData.class_features_and_traits);
      parsedData.race_features_and_traits = JSON.parse(parsedData.race_features_and_traits);
      parsedData.other_proficiencies = JSON.parse(parsedData.other_proficiencies);
      return parsedData;
    });
}

module.exports = {
  get: getCharacterByCampaignAndName
};
