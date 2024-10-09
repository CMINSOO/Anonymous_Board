import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateAuthInput } from './dto/create-auth.input';
import { User } from 'src/user/entities/user.entity';
import { SignInInput } from './dto/sign-in.input';
import { AuthPayload } from './object-types/auth-payload.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  //회원가입
  @Mutation(() => User)
  createUser(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
    return this.authService.createUser(createAuthInput);
  }

  //전체유저 조회
  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  getAllUser(): Promise<User[]> {
    return this.authService.findAllUser();
  }

  @Mutation(() => AuthPayload, { name: 'signIn' })
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<AuthPayload> {
    const data = await this.authService.signIn(signInInput);
    return {
      user: data,
      token: data.token,
    };
  }

  // @Mutation('updateAuth')
  // update(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
  //   return this.authService.update(updateAuthInput.id, updateAuthInput);
  // }

  // @Mutation('removeAuth')
  // remove(@Args('id') id: number) {
  //   return this.authService.remove(id);
  // }
}
