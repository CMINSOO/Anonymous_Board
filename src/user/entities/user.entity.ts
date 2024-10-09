import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  email: string;

  @Column()
  @Field(() => String)
  name: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
