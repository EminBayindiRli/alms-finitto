import { ref } from 'vue';
import supabase from '../lib/supabase';

// Authentication state
export const user = ref(null);
export const session = ref(null);
export const loading = ref(true);

// Initialize auth state
export async function initAuth() {
  loading.value = true;
  
  // Get current session
  const { data } = await supabase.auth.getSession();
  session.value = data.session;
  user.value = session.value?.user || null;
  
  loading.value = false;
  
  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession;
    user.value = newSession?.user || null;
  });
}

// Login with email/password
export async function login(email, password) {
  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  } finally {
    loading.value = false;
  }
}

// Logout
export async function logout() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error logging out:', error.message);
  } finally {
    loading.value = false;
  }
}

// Get user role from user metadata
export function getUserRole() {
  if (!user.value) return null;
  return user.value.user_metadata?.role || 'employee';
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!user.value;
}

// Check if user has a specific role
export function hasRole(role) {
  return getUserRole() === role;
}
