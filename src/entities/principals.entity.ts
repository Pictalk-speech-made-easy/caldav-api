import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('principals')
export class Principal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uri: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  displayname: string;
}
