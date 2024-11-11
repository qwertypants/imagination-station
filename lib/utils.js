import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Encode an object to be used as a URL parameter
export function encodeObjectToURL(obj) {
  try {
    // Convert object to JSON string
    const jsonString = JSON.stringify(obj);
    // Convert to base64
    const encoded = btoa(jsonString);
    // Make the base64 string URL-safe
    return encodeURIComponent(encoded);
  } catch (error) {
    console.error("Error encoding object:", error);
    throw error;
  }
}

// Decode a URL parameter back to an object
export function decodeURLToObject(encodedStr) {
  try {
    // Decode the URL-safe string
    const decoded = decodeURIComponent(encodedStr);
    // Convert from base64 to string
    const jsonString = atob(decoded);
    // Parse JSON string back to object
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error decoding string:", error);
    throw error;
  }
}
