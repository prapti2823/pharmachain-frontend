export const validateBatchForm = (formData) => {
  const errors = {};

  if (!formData.medicine_name?.trim()) {
    errors.medicine_name = 'Medicine name is required';
  }

  if (!formData.manufacturer?.trim()) {
    errors.manufacturer = 'Manufacturer is required';
  }

  if (!formData.batch_number?.trim()) {
    errors.batch_number = 'Batch number is required';
  }

  if (!formData.expiry_date) {
    errors.expiry_date = 'Expiry date is required';
  } else if (new Date(formData.expiry_date) <= new Date()) {
    errors.expiry_date = 'Expiry date must be in the future';
  }

  if (!formData.ingredients?.trim()) {
    errors.ingredients = 'Ingredients are required';
  }

  if (!formData.quantity_manufactured || formData.quantity_manufactured <= 0) {
    errors.quantity_manufactured = 'Valid quantity is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateImage = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (!file) {
    return { isValid: false, error: 'Image is required' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG and PNG images are allowed' };
  }

  return { isValid: true };
};