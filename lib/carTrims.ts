// Curated trim/grade options per make + model. Trim names here should NOT repeat
// the model name (e.g. Lexus LS trims are '460', '460L', not 'LS460 L') so that
// "{year} {make} {model} {trim}" never duplicates words.
// Coverage is intentionally scoped to the highest-volume makes/models in the UAE
// market to avoid guessing at trims we're not confident about. Anything not listed
// here falls back to a free-text trim field in the forms.
export const TRIMS: Record<string, Record<string, string[]>> = {
  Toyota: {
    'Land Cruiser': ['GXR', 'VXR', 'GX-R', 'VX', 'GX', 'EXR'],
    'Land Cruiser Prado': ['TXL', 'VXL', 'GXR', 'TX'],
    Camry: ['LE', 'SE', 'XLE', 'XSE', 'GLX'],
    Corolla: ['L', 'LE', 'SE', 'XLE', 'XSE', 'GLI'],
    RAV4: ['LE', 'XLE', 'SE', 'Adventure', 'Limited'],
    Fortuner: ['GX', 'GXR', 'VX', 'VXR'],
    Hilux: ['GL', 'GLX', 'SR5', 'Adventure'],
  },
  Nissan: {
    Patrol: ['XE', 'SE', 'LE', 'Nismo', 'Platinum'],
    Altima: ['S', 'SV', 'SL', 'SR'],
    'X-Trail': ['S', 'SV', 'SL'],
  },
  // Verified against live dubizzle.com UAE trim facets, July 2026.
  Lexus: {
    LS: ['400', '430', '430 1/2 Ultra', '430 3/4 Ultra', '430 Full Ultra', '460', '460 1/2 Ultra', '460 3/4 Ultra', '460 F Sport', '460 Full Ultra', '460 Platinum', '460 Premier', '460 Prestige Plus', '460 Titanium', '350 Prestige', '500', '500 Platinum', '600h L'],
    ES: ['250', '250 Platinum', '300', '300h', '300h Platinum', '300h Premier', '350', '350 F Sport', '350 Luxury', '350 Platinum', '350 Premier', '350 Prestige', '350 Ultra Luxury'],
    IS: ['200t', '200t F Sport', '250', '250 F Sport', '250 F Sport Platinum', '250 Platinum', '250 Premier', '300', '300 F Sport', '300 Platinum', '300 Premier', '350', '350 F Sport', '350 F Sport Platinum', '350 F Sport Prestige', '500 F Sport'],
    RX: ['330', '350', '350 F Sport', '350 Platinum', '350 Premier', '350 Prestige', '350 Standard', '350h Platinum', '350h Premier', '450h', '450h F Sport', '450h Platinum', '450h Prestige', '500h', '500h F Sport', '500h F Sport Performance'],
    GX: ['460', '460 Luxury', '460 Platinum', '460 Premier', '460 Premium Plus'],
    LX: ['470', '570 Base', '570 Black Edition', '570 Luxury', '570 Platinum', '570 Premier', '570 Signature', '570 Sport', '570 Sport S+', '600 Base', '600 F Sport', '600 Premier', '600 Premium', '600 Prestige', '600 Signature', '600 VIP', '700h F-Sport', '700h Signature', '700h VIP'],
    NX: ['250', '300', '350h', '450h+', 'F Sport'],
  },
  'Mercedes-Benz': {
    'C-Class': ['C180', 'C200', 'C250', 'C300', 'C43 AMG'],
    'E-Class': ['E200', 'E250', 'E300', 'E350', 'E450', 'E53 AMG'],
    'S-Class': ['S450', 'S500', 'S560', 'S580', 'S680'],
    GLE: ['GLE350', 'GLE450', 'GLE53 AMG', 'GLE580'],
    GLC: ['GLC200', 'GLC300', 'GLC43 AMG'],
    GLS: ['GLS450', 'GLS580', 'GLS63 AMG'],
    ML: ['ML320', 'ML350', 'ML400', 'ML500', 'ML550', 'ML63 AMG'],
    'G-Class': ['G500', 'G550', 'G63 AMG', 'G65 AMG'],
  },
  BMW: {
    '3 Series': ['318i', '320i', '330i', '340i', 'M340i'],
    '5 Series': ['520i', '525i', '530i', '540i', 'M550i'],
    '7 Series': ['730i', '740i', '750i', '760i'],
    X5: ['sDrive40i', 'xDrive40i', 'xDrive50i', 'M50i'],
    X6: ['xDrive35i', 'xDrive40i', 'xDrive50i', 'M50i'],
    X7: ['xDrive40i', 'xDrive50i', 'M50i'],
  },
  'Land Rover': {
    'Range Rover': ['SE', 'HSE', 'Autobiography', 'SVAutobiography'],
    'Range Rover Sport': ['SE', 'HSE', 'HSE Dynamic', 'Autobiography', 'SVR'],
    'Range Rover Velar': ['S', 'SE', 'HSE', 'R-Dynamic'],
    'Range Rover Evoque': ['S', 'SE', 'HSE', 'R-Dynamic'],
    Defender: ['90', '110', '130', 'X'],
  },
  Audi: {
    A6: ['35 TFSI', '40 TFSI', '45 TFSI', '55 TFSI', 'S6'],
    A8: ['50 TFSI', '55 TFSI', '60 TFSI', 'S8'],
    Q7: ['45 TFSI', '55 TFSI', 'SQ7'],
    Q8: ['45 TFSI', '55 TFSI', 'SQ8', 'RS Q8'],
  },
  Porsche: {
    '911': ['Carrera', 'Carrera S', 'Carrera 4S', 'Turbo', 'Turbo S', 'GT3'],
    Cayenne: ['Base', 'S', 'GTS', 'Turbo', 'Turbo GT'],
    Macan: ['Base', 'S', 'GTS', 'Turbo'],
    Panamera: ['Base', '4', '4S', 'Turbo', 'Turbo S'],
  },
  Honda: {
    Accord: ['LX', 'Sport', 'EX', 'EX-L', 'Touring'],
    'CR-V': ['LX', 'EX', 'EX-L', 'Touring'],
  },
  Hyundai: {
    Elantra: ['SE', 'SEL', 'Limited', 'N Line'],
    Tucson: ['SE', 'SEL', 'Limited', 'N Line'],
    'Santa Fe': ['SE', 'SEL', 'Limited', 'Calligraphy'],
  },
  Kia: {
    Sportage: ['LX', 'EX', 'SX', 'GT-Line'],
    Sorento: ['LX', 'EX', 'SX', 'GT-Line'],
  },
  Ford: {
    'F-150': ['XL', 'XLT', 'Lariat', 'King Ranch', 'Platinum', 'Raptor'],
    Explorer: ['Base', 'XLT', 'Limited', 'ST', 'Platinum'],
    Mustang: ['EcoBoost', 'GT', 'Mach 1', 'Shelby GT500'],
  },
};

export function trimsFor(make: string, model: string): string[] {
  return TRIMS[make]?.[model] || [];
}
