import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntryEntity, QueueStatus } from './entities/queue-entry.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(QueueEntryEntity)
    private queueRepo: Repository<QueueEntryEntity>,
  ) {}

  async joinQueue(clientId: string, barberId?: string) {
    const currentCount = await this.queueRepo.count({
      where: { status: QueueStatus.WAITING },
    });

    const entry = this.queueRepo.create({
      client: { id: clientId },
      barber: barberId ? { id: barberId } : null,
      position: currentCount + 1,
      estimatedWait: (currentCount + 1) * 20, // Simple 20m per person logic
      status: QueueStatus.WAITING,
    });

    return this.queueRepo.save(entry);
  }

  async getActiveQueue() {
    return this.queueRepo.find({
      where: { status: QueueStatus.WAITING },
      relations: ['client', 'barber'],
      order: { position: 'ASC' },
    });
  }
}