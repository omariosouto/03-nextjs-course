import nookies from 'nookies';
import { HttpClient } from '../../src/infra/HttpClient/HttpClient';
import { tokenService } from '../../src/services/auth/tokenService';

const REFRESH_TOKEN_NAME = 'REFRESH_TOKEN_NAME';

const controllers = {
  async storeRefreshToken(req, res) {
    const ctx = { req, res };
    console.log('handler', req.body);

    nookies.set(ctx, REFRESH_TOKEN_NAME, req.body.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
    })

    res.json({
      data: {
        message: 'Stored with success!'
      }
    });
  },
  async displayCookies(req, res) {
    const ctx = { req, res };
    res.json({
      data: {
        cookies: nookies.get(ctx),
      }
    });
  },
  async regenerateTokens(req ,res) {
    const ctx = { req, res };
    const cookies = nookies.get(ctx);
    const refresh_token = cookies[REFRESH_TOKEN_NAME];

    const refreshResponse = await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
      method: 'POST',
      body: {
        refresh_token,
      }      
    })

    if(refreshResponse.ok) {
      nookies.set(ctx, REFRESH_TOKEN_NAME, refreshResponse.body.data.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
      })
      
      tokenService.save(refreshResponse.body.data.access_token, ctx);

      res.json({
        refreshResponse
      })
    } else {
      res.json({
        status: 401,
        message: 'Não autorizado'
      })
    }
  }
}

const controllerBy = {
  POST: controllers.storeRefreshToken,
  GET: controllers.regenerateTokens,
  // GET: controllers.displayCookies,
}

export default function handler(request, response) {
  if (controllerBy[request.method]) return controllerBy[request.method](request, response);

  response.status(404).json({
    status: 404,
    message: 'Not Found'
  })
}
