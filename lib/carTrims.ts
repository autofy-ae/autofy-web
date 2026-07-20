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
  Lexus: {
    LS: ['460', '460L', '500', '500h', 'F Sport'],
    ES: ['250', '300', '300h', '350', 'F Sport'],
    IS: ['300', '350', 'F Sport'],
    RX: ['350', '350h', '450h', '500h', 'F Sport'],
    GX: ['460', '460 Premium', 'F Sport'],
    LX: ['570', '600'],
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
