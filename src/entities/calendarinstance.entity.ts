import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('calendarinstances')
export class CalendarInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  principaluri: string;

  @Column()
  displayname: string;

  @Column()
  uri: string;

  @Column()
  access: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  transparent: boolean;

  @Column()
  calendarcolor: string;

  @Column()
  timezone: string;

  // Make sure to create a relation back to the Calendar entity
  @Column()
  calendarid: number;
}
