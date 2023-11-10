import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['username'])
  username: string;

  @Column()
  digesta1: string;
}
