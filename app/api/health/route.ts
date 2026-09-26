/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * API Architect — Health Check Route (Next.js App Router Specification)
 * GET /api/health
 */

export async function GET() {
  return Response.json({
    status: 'ok',
  });
}
