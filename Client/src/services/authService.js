const API_URL = import.meta.env.VITE_BACKEND_API_URL ? `${import.meta.env.VITE_BACKEND_API_URL}/auth` : 'http://localhost:5000/api/auth';

export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Server error. Please try again later.' };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Server error. Please try again later.' };
  }
};
