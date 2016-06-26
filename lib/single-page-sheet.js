const cheerio = require('cheerio');
const _ = require('lodash');

const formatMod = (mod) => {
  if (mod === 0) return mod;
  else if (mod < 0) return `-${mod}`;
  return `+${mod}`;
};

const formatModField = (field) => (data) => formatMod(+data[field]);

const skillMod = (field) => (
  (data) => {
    const score = +data[field];
    return formatMod(_.floor((score - 10) / 2));
  }
);

const passivePerception = (data) => 10 + (+data.perception);

const weaponName = (index) => (data) => {
  if (index > (data.attacks.length - 1)) return '';
  return data.attacks[index].name;
};

const weaponAtkBonus = (index) => (data) => {
  if (index > (data.attacks.length - 1)) return '';
  return data.attacks[index].bonus;
};

const weaponDamage = (index) => (data) => {
  if (index > (data.attacks.length - 1)) return '';
  return data.attacks[index].damage;
};

const cb = (field) => (data) => (data[field] === '1' ? 'Yes' : 'Off');

const list = (field) => (data) => (
  `${data[field].join(', ')}`
);

const titledList = (listTitle, field) => (data) => (
  `${listTitle}\n${list(field)(data)}`
);

const bulletList = (listTitle, field) => (data) => {
  let content = `${listTitle}\n`;
  data[field].forEach((e) => {
    content = content.concat(`- ${e}\n`);
  });
  return content;
};

const proficiencies = (data) => {
  const languages = titledList('Languages', 'languages')(data);
  const otherProfs = titledList('Other', 'other_proficiencies')(data);

  return `${languages}\n\n${otherProfs}`;
};

const features = (data) => {
  const classFeatures = bulletList('Class Features', 'class_features_and_traits')(data);
  const raceFeatures = bulletList('Race Features', 'race_features_and_traits')(data);

  return `${classFeatures}\n${raceFeatures}`;
};

const fieldMap = {
  AC: 'armor_class',
  Acrobatics: formatModField('acrobatics'),
  Alignment: 'alignment',
  Animal: formatModField('animal_handling'),
  Arcana: formatModField('arcana'),
  Athletics: formatModField('athletics'),
  AttacksSpellcasting: bulletList('Cantrips', 'cantrips'),
  Background: 'background',
  Bonds: null,
  CHA: 'cha',
  CHamod: skillMod('cha'),
  'Check Box 11': cb('proficiency_str_save'),
  'Check Box 12': null, // Death success 1
  'Check Box 13': null, // Death success 2
  'Check Box 14': null, // Death success 3
  'Check Box 15': null, // Death fail 1
  'Check Box 16': null, // Death fail 2
  'Check Box 17': null, // Death fail 3
  'Check Box 18': cb('proficiency_dex_save'),
  'Check Box 19': cb('proficiency_con_save'),
  'Check Box 20': cb('proficiency_int_save'),
  'Check Box 21': cb('proficiency_wis_save'),
  'Check Box 22': cb('proficiency_cha_save'),
  'Check Box 23': cb('proficiency_acrobatics'),
  'Check Box 24': cb('proficiency_animal_handling'),
  'Check Box 25': cb('proficiency_arcana'),
  'Check Box 26': cb('proficiency_athletics'),
  'Check Box 27': cb('proficiency_deception'),
  'Check Box 28': cb('proficiency_history'),
  'Check Box 29': cb('proficiency_insight'),
  'Check Box 30': cb('proficiency_intimidation'),
  'Check Box 31': cb('proficiency_investigation'),
  'Check Box 32': cb('proficiency_medicine'),
  'Check Box 33': cb('proficiency_nature'),
  'Check Box 34': cb('proficiency_perception'),
  'Check Box 35': cb('proficiency_performance'),
  'Check Box 36': cb('proficiency_persuasion'),
  'Check Box 37': cb('proficiency_religion'),
  'Check Box 38': cb('proficiency_sleight_of_hand'),
  'Check Box 39': cb('proficiency_stealth'),
  'Check Box 40': cb('proficiency_survival'),
  CON: 'con',
  CONmod: skillMod('con'),
  CP: null,
  CharacterName: (data) => cheerio.load(data.name)('span').text(),
  ClassLevel: (data) => `${data.class} (${data.level})`,
  DEX: 'dex',
  'DEXmod ': skillMod('dex'),
  'Deception ': formatModField('deception'),
  EP: null,
  Equipment: list('equipment'),
  'Features and Traits': features,
  Flaws: null,
  GP: null,
  HD: 'hit_dice',
  HDTotal: 'level',
  HPCurrent: null,
  HPMax: 'max_hit_points',
  HPTemp: null,
  'History ': formatModField('history'),
  INT: 'int',
  INTmod: skillMod('int'),
  Ideals: null,
  Initiative: formatModField('initiative'),
  Insight: formatModField('insight'),
  Inspiration: null,
  Intimidation: formatModField('intimidation'),
  'Investigation ': formatModField('investigation'),
  Medicine: formatModField('medicine'),
  Nature: formatModField('nature'),
  PP: null,
  Passive: passivePerception,
  'Perception ': formatModField('perception'),
  Performance: formatModField('performance'),
  'PersonalityTraits ': null,
  Persuasion: formatModField('persuasion'),
  PlayerName: (data) => cheerio.load(data.player)('span').text(),
  ProfBonus: 'proficiency_bonus',
  ProficienciesLang: proficiencies,
  'Race ': 'race',
  Religion: formatModField('religion'),
  SP: null,
  STR: 'str',
  STRmod: skillMod('str'),
  'ST Charisma': formatModField('cha_save'),
  'ST Constitution': formatModField('con_save'),
  'ST Dexterity': formatModField('dex_save'),
  'ST Intelligence': formatModField('int_save'),
  'ST Strength': formatModField('str_save'),
  'ST Wisdom': formatModField('wis_save'),
  SleightofHand: formatModField('sleight_of_hand'),
  Speed: 'speed',
  'Stealth ': formatModField('stealth'),
  Survival: formatModField('survival'),
  WIS: 'wis',
  WISmod: skillMod('wis'),
  'Wpn Name': weaponName(0),
  'Wpn Name 2': weaponName(1),
  'Wpn Name 3': weaponName(2),
  'Wpn1 AtkBonus': weaponAtkBonus(0),
  'Wpn1 Damage': weaponDamage(0),
  'Wpn2 AtkBonus ': weaponAtkBonus(1),
  'Wpn2 Damage ': weaponDamage(1),
  'Wpn3 AtkBonus ': weaponAtkBonus(2),
  'Wpn3 Damage ': weaponDamage(2),
  XP: 'xp'
};

module.exports = {
  filename: '/sheets/Character Sheet - Form Fillable.pdf',
  fieldMap
};
