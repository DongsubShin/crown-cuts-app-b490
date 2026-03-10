import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { ClientEntity } from '../../client/entities/client.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { CommissionEntity } from '../../commission/entities/commission.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NOSHOW = 'no-show',
}

@Entity('bookings')
export class BookingEntity extends BaseEntity {
  @ManyToOne(() => BarberEntity, (barber) => barber.bookings)
  @JoinColumn({ name: 'barber_id' })
  barber: BarberEntity;

  @ManyToOne(() => ClientEntity, (client) => client.bookings)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Index()
  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp with time zone' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ManyToMany(() => ServiceEntity, (service) => service.bookings)
  @JoinTable({
    name: 'booking_services',
    joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: ServiceEntity[];

  @OneToOne(() => PaymentEntity, (payment) => payment.booking)
  payment: PaymentEntity;

  @OneToOne(() => CommissionEntity, (commission) => commission.booking)
  commission: CommissionEntity;
}