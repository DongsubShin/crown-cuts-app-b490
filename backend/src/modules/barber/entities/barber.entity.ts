import { Entity, Column, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';
import { QueueEntryEntity } from '../../queue/entities/queue-entry.entity';
import { CommissionEntity } from '../../commission/entities/commission.entity';

@Entity('barbers')
export class BarberEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.barberProfile)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[];

  @Column({ name: 'working_hours', type: 'jsonb', nullable: true })
  workingHours: any; // Format: { monday: { start: "09:00", end: "17:00" }, ... }

  @Index()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => BookingEntity, (booking) => booking.barber)
  bookings: BookingEntity[];

  @OneToMany(() => QueueEntryEntity, (queue) => queue.barber)
  queueEntries: QueueEntryEntity[];

  @OneToMany(() => CommissionEntity, (commission) => commission.barber)
  commissions: CommissionEntity[];
}