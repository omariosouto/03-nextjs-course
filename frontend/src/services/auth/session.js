import { authService } from './authService';

export function withSession(funcao) {
  return async (ctx) => {
    try {
      const session = await authService.getSession(ctx);
      const modifiedCtx = {
        ...ctx,
        req: {
          ...ctx.req,
          session,
        }
      };
      return funcao(modifiedCtx);
    } catch(err) {
      return {
        redirect: {
          permanent: false,
          destination: '/?error=401',
        }
      }
    }
  }
}
