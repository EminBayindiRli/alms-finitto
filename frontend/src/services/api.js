import { user } from './auth';

// API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Common fetch options
const getOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add access token if user is logged in
  if (user.value?.access_token) {
    options.headers['Authorization'] = `Bearer ${user.value.access_token}`;
  }

  // Add body if provided
  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// API endpoints
export const api = {
  // Employee data endpoints
  getAllEmployeeAnalysis: async () => {
    try {
      const response = await fetch(`${API_URL}/analyze/all`, getOptions());
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all employee analysis:', error);
      return null;
    }
  },
  
  // Get individual employee analysis
  getEmployeeAnalysis: async (employeeId) => {
    try {
      const response = await fetch(`${API_URL}/employee/${employeeId}`, getOptions());
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching employee ${employeeId} analysis:`, error);
      return null;
    }
  },
  
  // Generate reports
  generateReports: async () => {
    try {
      const response = await fetch(`${API_URL}/generate/reports`, getOptions('POST'));
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error generating reports:', error);
      return null;
    }
  },
  
  // Get employee report URL
  getEmployeeReportUrl: (employeeId) => {
    return `${API_URL}/employee/${employeeId}/report`;
  }
};

export default api;
