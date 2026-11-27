// Deliberate opt-in: production mode does not load .env.development.
export const profileAdminMock = import.meta.env.VITE_PROFILE_ADMIN_MOCK === 'true'
export const DEMO_TOKEN_PREFIX = 'profile-admin-demo:'

export function isDemoToken(value) {
  return typeof value === 'string' && /^[a-z0-9-]+-demo:\d+$/i.test(value)
}
