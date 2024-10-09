import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      //header에 authroization에서 bearer토큰 가져오기
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secret key는 이걸썻다 라고 명시해주는것
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: { userId: number }) {
    console.log('여긴와?');
    const user = await this.authService.findById(payload.userId);
    console.log(user);
    return user;
  }
}
