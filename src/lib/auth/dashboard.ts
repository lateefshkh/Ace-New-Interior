export function verifyDashboardPassword(password: string): boolean {
  const valid = process.env.DASHBOARD_PASSWORD?.trim();
  if (!valid) return false;
  return password.trim() === valid;
}

export function getPasswordFromRequest(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

export function isDashboardAuthorized(request: Request): boolean {
  const password = getPasswordFromRequest(request);
  if (!password) return false;
  return verifyDashboardPassword(password);
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
