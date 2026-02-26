const BASE_URL = 'http://192.168.0.11:5001/api'; //'https://muratsahindev/api/plantapp'; // Change to your actual API URL

export default class ApiService {
  static token = null; // Optional: token for auth

  static get getBaseUrl(){
    return BASE_URL;
  }

  static setToken(newToken) {
    this.token = newToken;
  }

  static async request(endpoint, method = 'GET', body = null) {
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      // 204 No Content or other empty-body responses
      const contentType = response.headers.get('content-type');
      const hasJsonBody = contentType && contentType.includes('application/json');

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        if (hasJsonBody) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // ignore JSON parse failure on error responses
          }
        }
        throw new Error(errorMessage);
      }

      // Return null for responses with no body (e.g. 204 No Content)
      if (!hasJsonBody || response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`[${method}] ${url} error:`, error);
      throw error;
    }
  }

  static get(endpoint) {
    return this.request(endpoint, 'GET');
  }

  static post(endpoint, body) {
    return this.request(endpoint, 'POST', body);
  }

  static put(endpoint, body) {
    return this.request(endpoint, 'PUT', body);
  }

  static delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  }

  static getPlants(userId) {
    const endpoint = userId ? `plants?userId=${userId}` : 'plants';
    return this.get(endpoint);
  }

  static createPlant(plant) {
    return this.post('plants', plant);
  }

  static updatePlant(id, plant) {
    return this.put(`plants/${id}`, plant);
  }

  static deletePlant(id) {
    return this.delete(`plants/${id}`);
  }

  static login(credentials) {
    return this.post('auth/login', credentials);
  }

  static register(payload) {
    return this.post('auth/register', payload);
  }

  static updateProfile(payload) {
    return this.put('auth/profile', payload);
  }

  static deleteAccount(userId) {
    return this.delete(`auth/account/${userId}`);
  }

  static forgotPassword(email) {
    return this.post('auth/forgot-password', { email });
  }

  static verifyResetCode(email, code) {
    return this.post('auth/verify-reset-code', { email, code });
  }

  static resetPassword(email, code, newPassword) {
    return this.post('auth/reset-password', { email, code, newPassword });
  }
}
