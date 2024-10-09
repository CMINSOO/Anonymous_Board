import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
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

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthInput: UpdateAuthInput) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
