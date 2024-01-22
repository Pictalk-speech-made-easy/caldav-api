import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CalendarInstance } from './calendarinstance.entity';

@Entity('calendars')
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  synctoken: number;

  @Column()
  components: string;
}
