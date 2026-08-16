export function validateFighter(f: any): string[] {
  const errors: string[] = [];
  if (!f || typeof f !== 'object') {
    errors.push('Payload must be an object');
    return errors;
  }

  if (!f.slug || typeof f.slug !== 'string' || !/^[a-z0-9\-]+$/.test(f.slug)) errors.push('slug is required and must be lower-case alphanum with dashes');
  if (!f.display_name || typeof f.display_name !== 'string') errors.push('display_name is required');
  if (f.first_name && typeof f.first_name !== 'string') errors.push('first_name must be a string');
  if (f.last_name && typeof f.last_name !== 'string') errors.push('last_name must be a string');

  if (f.nationality && (typeof f.nationality !== 'string' || f.nationality.length !== 2)) errors.push('nationality must be a 2-letter code');
  if (f.birth_date && isNaN(Date.parse(f.birth_date))) errors.push('birth_date must be a valid date');

  ['height_cm','reach_cm','record_wins','record_losses','record_draws','record_nc','rank'].forEach((k) => {
    if (f[k] != null && typeof f[k] !== 'number') errors.push(`${k} must be a number`);
  });

  if (f.weight_category) {
    if (typeof f.weight_category !== 'object' || !f.weight_category.name) errors.push('weight_category.name is required');
  }

  if (f.organizations) {
    if (!Array.isArray(f.organizations)) errors.push('organizations must be an array');
    else {
      f.organizations.forEach((o: any, i: number) => {
        if (!o.name || typeof o.name !== 'string') errors.push(`organizations[${i}].name is required`);
      });
    }
  }

  if (f.fights) {
    if (!Array.isArray(f.fights)) errors.push('fights must be an array');
    else {
      f.fights.forEach((ff: any, i: number) => {
        if (!ff.id) errors.push(`fights[${i}].id is required`);
        if (ff.date && isNaN(Date.parse(ff.date))) errors.push(`fights[${i}].date must be a valid date`);
        ['event_name','opponent_name','method'].forEach((k) => { if (!ff[k]) errors.push(`fights[${i}].${k} is required`); });
        if (ff.result && !['win','loss','draw','nc'].includes(ff.result)) errors.push(`fights[${i}].result must be one of win|loss|draw|nc`);
      });
    }
  }

  return errors;
}
