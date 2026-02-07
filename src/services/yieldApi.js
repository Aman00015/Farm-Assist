const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const yieldApi = {
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Backend is not responding');
    }
    return await response.json();
  },

  async getStatus() {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error('Failed to fetch model status');
    }
    return await response.json();
  },

  async getAvailableCrops() {
    const response = await fetch(`${API_BASE_URL}/available-crops`);
    if (!response.ok) {
      throw new Error('Failed to fetch available crops');
    }
    return await response.json();
  },

  async getAvailableStates() {
    const response = await fetch(`${API_BASE_URL}/available-states`);
    if (!response.ok) {
      throw new Error('Failed to fetch available states');
    }
    return await response.json();
  },

  async trainModel() {
    const response = await fetch(`${API_BASE_URL}/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Training failed');
    }
    return await response.json();
  },

  async predictYield(formData) {
    const response = await fetch(`${API_BASE_URL}/predict-yield`, {  // Changed from /predict to /predict-yield
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Prediction failed');
    }
    return await response.json();
  }
};