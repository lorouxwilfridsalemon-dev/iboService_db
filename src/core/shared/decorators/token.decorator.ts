
import { createParamDecorator } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

export const TokenPayload = createParamDecorator((data, req) => {
    const jwtService : JwtService = new JwtService({});
    const headerAutorization : string = req.headers.authorization.replace('Bearer ','');
    return jwtService.decode(headerAutorization,{});
});
