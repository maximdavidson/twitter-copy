interface ValidationErrors {
  [key: string]: string | undefined;
}

export const validateLogin = (name: string, value: string): string | undefined => {
  switch (name) {
    case 'phoneOrEmail':
      if (!value) return 'Phone number or email is required';
      if (/^\+?\d+$/.test(value)) {
        if (!/^\+?\d+$/.test(value)) return 'Phone number must be numeric and can include +';
      } else if (/\S+@\S+\.\S+/.test(value)) {
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
      } else {
        return 'Please enter a valid phone number or email';
      }
      break;
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters long';
      break;
    default:
      break;
  }
  return undefined;
};

export const validateSignUp = (name: string, value: string): string | undefined => {
  switch (name) {
    case 'name':
      if (!value) return 'Name is required';
      if (!/^[a-zA-Z\s]+$/.test(value) || value.length < 2)
        return 'Name must contain only letters and spaces.';
      break;
    case 'phone':
      if (!value) return 'Phone is required';
      if (!/^\+?\d+$/.test(value)) return 'Phone must be numeric and can include +';
      break;
    case 'email':
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
      break;
    case 'month':
    case 'day':
    case 'year':
      if (!value) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      break;
    default:
      break;
  }
  return undefined;
};
