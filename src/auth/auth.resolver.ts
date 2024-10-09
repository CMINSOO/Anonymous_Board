import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  createUser(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
    return this.authService.createUser(createAuthInput);
  }

  // @Query('auth')
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Query('auth')
  // findOne(@Args('id') id: number) {
  //   return this.authService.findOne(id);
  // }

  // @Mutation('updateAuth')
  // update(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
  //   return this.authService.update(updateAuthInput.id, updateAuthInput);
  // }

  // @Mutation('removeAuth')
  // remove(@Args('id') id: number) {
  //   return this.authService.remove(id);
  // }
}
