import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionEntity } from './entities/commission.entity';
import { BookingEntity } from '../booking/entities/booking.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(CommissionEntity)
    private commissionRepo: Repository<CommissionEntity>,
  ) {}

  async calculateForBooking(booking: BookingEntity, rate: number = 0.6) {
    const totalAmount = booking.services.reduce((sum, s) => sum + Number(s.price), 0);
    const commissionAmount = totalAmount * rate;

    const commission = this.commissionRepo.create({
      barber: booking.barber,
      booking: booking,
      amount: commissionAmount,
      rate: rate * 100,
    });

    return this.commissionRepo.save(commission);
  }

  async getBarberEarnings(barberId: string) {
    return this.commissionRepo.find({
      where: { barber: { id: barberId } },
      relations: ['booking'],
    });
  }
}