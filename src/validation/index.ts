export const validateLogin = (name: string, value: string): string | undefined => {
  switch (name) {
    case 'phoneOrEmail':
      if (!value) return 'Email is required';
      else if (/\S+@\S+\.\S+/.test(value)) {
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
      } else {
        return 'Please enter a valid email';
      }
      break;
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters long';
      break;
  }
  return undefined;
};

export const validateSignUp = (name: string, value: string): string | undefined => {
  switch (name) {
    case 'name':
      if (!value) return 'Name is required';
      if (value.length < 2) return 'Name must contain only letters and spaces.';
      break;
    case 'email':
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
      break;
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters long';
      break;
    case 'month':
    case 'day':
    case 'year':
      if (!value) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      break;
  }
  return undefined;
};

export const validateProfile = (name: string, value: string): string | undefined => {
  switch (name) {
    case 'name':
      if (!value) return 'Name is required';
      break;
    case 'telegram':
      if (!value) return 'telegram is required';
      if (!/^[a-zA-Z0-9_@]+$/.test(value)) return 'telegram must be in English';
      if (!value.startsWith('@')) return 'telegram must start with @';
      break;
    case 'info':
      if (value.length > 300) return 'Info must be at least 300 characters long';
      break;
  }
  return undefined;
};
