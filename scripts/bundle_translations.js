const fs = require('fs');
const { en } = require('./lang_en');
const { fr } = require('./lang_fr');
const { ar } = require('./lang_ar');
const { tn } = require('./lang_tn');

const translations = { en, fr, ar, tn };

const fileContent = `import { Language } from '../types';

export const translations: Record<Language, any> = ${JSON.stringify(translations, null, 2)};
`;

fs.writeFileSync('src/i18n/translations.ts', fileContent, 'utf8');
console.log('src/i18n/translations.ts successfully generated!');
