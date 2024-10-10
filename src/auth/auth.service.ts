import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { NotFoundError } from 'rxjs';
import { SignInInput } from './dto/sign-in.input';
import { validatePassword } from './util/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(createAuthInput: CreateAuthInput) {
    const { email, password, confirmPassword, name } = createAuthInput;

    const isExistEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (isExistEmail) {
      throw new ConflictException('이미 사용중인 이메일입니다');
    }
    if (password !== confirmPassword) {
      throw new BadRequestException('비밀번호를 다시 확인해주세요');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userData = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });
    const user = await this.userRepository.save(userData);
    user.password = undefined;

    return user;
  }

  async findAllUser() {
    const user = await this.userRepository.find();

    if (!user) {
      throw new NotFoundError('유저 정보를 찾을수없습니다.');
    }

    return user;
  }

  async signIn(signInInput: SignInInput) {
    const { email, password } = signInInput;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundError('존재하지 않은 유저입니다');
    }
    const isPasswordValidate = await validatePassword(password, user.password);
    if (!isPasswordValidate) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세여');
    }

    const token = await this.createToken(user.id);

    return { ...user, token };
  }

  async createToken(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
    });

    return accessToken;
  }

  async findById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('접근 오류');
    }
    return user;
  }
}
