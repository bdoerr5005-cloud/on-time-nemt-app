// Local demo roles.
// For zero-setup mode, we treat a single email as "Admin".

export const ADMIN_EMAIL = 'bdoerr5005@gmail.com'

export async function isAdminByUser(user) {
  if (!user?.email) return false
  return String(user.email).toLowerCase() === ADMIN_EMAIL
}
