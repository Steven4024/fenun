type ApiResponse = { razonSocial?: string; nombre?: string; nombres?: string; apellidoPaterno?: string; apellidoMaterno?: string; apellido_paterno?: string; apellido_materno?: string; data?: Record<string, string> };

export async function lookupDocument(document: string): Promise<string> {
  const token = import.meta.env.VITE_DOCUMENT_API_TOKEN as string | undefined;
  if (!token) throw new Error('Consulta documental no configurada.');
  const isRuc = document.length === 11;
  const response = await fetch(`https://api.apiperu.dev/${isRuc ? 'ruc' : 'dni'}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(isRuc ? { ruc: document } : { dni: document }),
  });
  if (!response.ok) throw new Error('No se encontraron datos para este documento.');
  const result = await response.json() as ApiResponse;
  const data = result.data ?? result;
  const name = data.razonSocial ?? data.nombre ?? [data.nombres, data.apellidoPaterno ?? data.apellido_paterno, data.apellidoMaterno ?? data.apellido_materno].filter(Boolean).join(' ');
  if (!name) throw new Error('No se encontraron datos para este documento.');
  return name;
}
