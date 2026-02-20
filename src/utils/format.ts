export const formatValidationErrors = (errors: any) => {
  if (!errors || !errors.issues) return 'Validation failed';

  if (Array.isArray(errors.issues)) {
    return errors.issues.map((error: any) => error.message);
  }
  return JSON.stringify(errors);
};
