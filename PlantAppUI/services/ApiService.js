const BASE_URL = 'http://<your-ip-address>:5001/api';

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
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
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
}
