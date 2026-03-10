import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';

@Entity('services')
export class ServiceEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'int', comment: 'Duration in minutes' })
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @ManyToMany(() => BookingEntity, (booking) => booking.services)
  bookings: BookingEntity[];
}