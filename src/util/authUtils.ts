interface DecodedToken {
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
}

// Simple JWT decode (no signature verification). Handles base64url.
function jwtDecode(token: string): DecodedToken {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return {};
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    // pad base64 string
    const pad = payload.length % 4;
    const padded = payload + (pad ? '='.repeat(4 - pad) : '');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json) as DecodedToken;
  } catch (e) {
    return {};
  }
}

/**
 * Validates if a token is valid and not expired
 */
export function isTokenValid(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    
    if (!decoded.exp) return false;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
}

/**
 * Retrieves the stored JWT token from localStorage
 */
export function getTokenFromStorage(): string | null {
  return localStorage.getItem("authToken");
}

/**
 * Checks if user is authenticated by validating the stored token
 */
export function isAuthenticated(): boolean {
  const token = getTokenFromStorage();
  return token !== null && isTokenValid(token);
}

/**
 * Gets the email from the stored token
 */
export function getEmailFromToken(): string | null {
  const token = getTokenFromStorage();
  if (!token) return null;
  
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.sub || decoded.email || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Removes the token from localStorage (logout)
 */
export function clearAuthToken(): boolean {
  localStorage.removeItem("authToken");
  return true;
}

/**
 * Stores the token in localStorage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}
