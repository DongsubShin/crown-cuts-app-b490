import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity, NotificationType, NotificationStatus } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepo: Repository<NotificationEntity>,
  ) {}

  async sendSmsReminder(clientId: string, phoneNumber: string, message: string) {
    const notification = this.notificationRepo.create({
      client: { id: clientId },
      type: NotificationType.SMS,
      message,
      scheduledAt: new Date(),
      status: NotificationStatus.SENT,
      sentAt: new Date(),
    });

    // Integration with Twilio/AWS SNS would go here
    this.logger.log(`Sending SMS to ${phoneNumber}: ${message}`);
    
    return this.notificationRepo.save(notification);
  }
}