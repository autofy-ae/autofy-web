export const SPECIFICATIONS = ['GCC', 'American', 'Japanese', 'Korean', 'European', 'Canadian', 'Chinese', 'Other'];
export const DRIVETRAINS = ['FWD', 'RWD', 'AWD', '4WD'];
export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric'];
export const ENGINES = ['I3', 'I4/V4', 'I5', 'I6/V6', 'V8', 'V10', 'V12', 'V16', 'W16', 'Electric (maafi engine)'];
export const TRANSMISSIONS = ['Automatic', 'Manual'];
export const SEAT_OPTIONS = [2, 3, 4, 5, 6];
export const EXTERIOR_COLORS = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Gold', 'Beige', 'Brown', 'Orange', 'Bronze', 'Pink', 'Other'];
export const INTERIOR_COLORS = ['Black', 'Beige/Tan', 'Brown', 'Gray', 'Red', 'White', 'Blue', 'Green', 'Yellow', 'Orange', 'Other'];
export const HORSEPOWER_RANGES = ['0-151 bhp', '152-280 bhp', '281-385 bhp', '386-485 bhp', '486 - 585 bhp', '586+ bhp'];

export const SERVICE_HISTORY_OPTIONS = ['No History', 'Partial Service History', 'Full Service History', 'Agency Maintained'];
export const ACCIDENT_HISTORY_OPTIONS = ['None', 'Minor', 'Major'];
export const OWNERS_OPTIONS = ['1', '2', '3+'];
export const INTERIOR_CONDITION_OPTIONS = ['Worn', 'Good', 'Like New'];
export const PAINT_QUALITY_OPTIONS = ['Decent', 'Good', 'Excellent'];
export const TYRE_CONDITION_OPTIONS = ['Needs Replacement', 'Good', 'New'];
export const IMPORT_SPECS_OPTIONS = ['Other', 'US Specs', 'GCC Specs'];

export function rangeForExactHorsepower(hp: number): string {
  if (hp <= 151) return '0-151 bhp';
  if (hp <= 280) return '152-280 bhp';
  if (hp <= 385) return '281-385 bhp';
  if (hp <= 485) return '386-485 bhp';
  if (hp <= 585) return '486 - 585 bhp';
  return '586+ bhp';
}
