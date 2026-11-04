import { AppError } from './errors';

export async function jsonBody(request: Request, limit = 3_000_000): Promise<unknown> {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Use application/json.');
  const length = Number(request.headers.get('content-length') || 0);
  if (length > limit) throw new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
  if (!request.body) throw new AppError(400, 'INVALID_JSON', 'JSON body is required.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new AppError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new AppError(400, 'INVALID_JSON', 'Malformed JSON body.'); }
}
