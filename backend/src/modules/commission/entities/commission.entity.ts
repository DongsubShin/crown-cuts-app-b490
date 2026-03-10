import { Entity, Column, ManyToOne, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';

@Entity('commissions')
export class CommissionEntity extends BaseEntity {
  @ManyToOne(() => BarberEntity, (barber) => barber.commissions)
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;

  @OneToOne(() => BookingEntity, (booking) => booking.commission)
  @JoinColumn({ name: 'booking_id' })
  booking: BookingEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: 'Percentage rate' })
  rate: number;

  @Column({ name: 'paid_at', type: 'timestamp with time zone', nullable: true })
  paidAt?: Date;
}