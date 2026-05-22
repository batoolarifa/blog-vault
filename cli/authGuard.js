import { getToken } from "./api.js";

export function requireAuth(action = "this action") {
  const token = getToken();

  if (!token) {
    console.log(`❌ You must login or register before performing ${action}.`);
    return false;
  }

  return true;
}