// import { createParamDecorator } from '@nestjs/common';
// export const CurrentUser = createParamDecorator((_, request) => {
//     const user = request.args[0].user;
//     return user;
// })

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Récupère l'utilisateur attaché à la requête par JwtAuthGuard/JwtStrategy.
 * Usage : @CurrentUser() user: any
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
); 



