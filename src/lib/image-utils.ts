export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const RECOMMENDED_DIMENSIONS = {
  width: 1200,
  height: 800
};

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImage = async (file: File): Promise<ImageValidationResult> => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type not supported. Please upload: ${ACCEPTED_IMAGE_TYPES.join(', ')}` 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
    };
  }

  return { isValid: true };
};

export const createImageUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};