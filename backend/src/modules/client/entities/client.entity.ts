import { Entity, Column, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { BookingEntity } from '../../booking/entities/booking.entity';
import { QueueEntryEntity } from '../../queue/entities/queue-entry.entity';
import { NotificationEntity } from '../../notification/entities/notification.entity';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.clientProfile, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ name: 'full_name' })
  fullName: string;

  @Index()
  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ name: 'visit_count', default: 0 })
  visitCount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => BookingEntity, (booking) => booking.client)
  bookings: BookingEntity[];

  @OneToMany(() => QueueEntryEntity, (queue) => queue.client)
  queueEntries: QueueEntryEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.client)
  notifications: NotificationEntity[];
}