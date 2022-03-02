// Arquitetura Hexagonal

import { tokenService } from '../../services/auth/tokenService';

// Ports & Adapters
export async function HttpClient(fetchUrl, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  };
  return fetch(fetchUrl, options)
    .then(async (respostaDoServidor) => {
      return {
        ok: respostaDoServidor.ok,
        status: respostaDoServidor.status,
        statusText: respostaDoServidor.statusText,
        body: await respostaDoServidor.json(),
      }
    })
    .then(async (response) => {
      if(!fetchOptions.refresh) return response;
      if(response.status !== 401) return response;

      console.log('Middleware: Rodar código para atualizar o token');
      // [Tentar atualizar os tokens]
      const refreshResponse = await HttpClient('http://localhost:3000/api/refresh', {
        method: 'GET'
      });
      const newAccessToken = refreshResponse.body.data.access_token;
      const newRefreshToken = refreshResponse.body.data.refresh_token;

      // [Guarda os Tokens]
      tokenService.save(newAccessToken);

      // [Tentar rodar o request anterior]
      const retryResponse = await HttpClient(fetchUrl, {
        ...options,
        refresh: false,
        headers: {
          'Authorization': `Bearer ${newAccessToken}`
        }
      })

      return retryResponse;
    });
}
