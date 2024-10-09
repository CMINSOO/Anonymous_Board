import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateAuthInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsNotEmpty()
  confirmPassword: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;
}
