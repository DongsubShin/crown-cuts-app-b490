import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BarberEntity } from '../../barber/entities/barber.entity';
import { ClientEntity } from '../../client/entities/client.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('queue_entries')
export class QueueEntryEntity extends BaseEntity {
  @ManyToOne(() => ClientEntity, (client) => client.queueEntries)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => BarberEntity, (barber) => barber.queueEntries, { nullable: true })
  @JoinColumn({ name: 'barber_id' })
  barber?: BarberEntity;

  @Column({ type: 'int' })
  position: number;

  @Column({
    type: 'enum',
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({ name: 'estimated_wait_minutes', type: 'int' })
  estimatedWait: number;
}