/**
 * Turns an HttpErrorResponse into copy a user can act on, distinguishing the
 * status codes called out in ui.md §0: 400 (field errors), 401 (not logged in —
 * handled globally by the token interceptor before most callers ever see it),
 * 403 (wrong role) and 404 (right role, object not in your scope).
 */
export function describeHttpError(err: any, action: string = 'load this'): string {
  const status = err?.status;

  if (status === 403) {
    return `You don't have permission to ${action}.`;
  }
  if (status === 404) {
    return `This isn't available, or doesn't belong to your account/area.`;
  }
  if (status === 401) {
    return 'Your session has expired. Please log in again.';
  }
  if (status === 400) {
    const body = err?.error;
    if (body && typeof body === 'object') {
      const firstKey = Object.keys(body)[0];
      if (firstKey) {
        const val = body[firstKey];
        return Array.isArray(val) ? val[0] : String(val);
      }
    }
  }

  return err?.error?.detail || `Could not ${action}. Please try again later.`;
}
