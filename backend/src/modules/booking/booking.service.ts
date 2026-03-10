import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BookingEntity, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ServiceEntity } from '../service/entities/service.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepo: Repository<BookingEntity>,
    @InjectRepository(ServiceEntity)
    private serviceRepo: Repository<ServiceEntity>,
  ) {}

  async create(dto: CreateBookingDto) {
    const services = await this.serviceRepo.findBy({ id: In(dto.serviceIds) });
    if (services.length !== dto.serviceIds.length) {
      throw new BadRequestException('One or more services not found');
    }

    const totalDuration = services.reduce((acc, s) => acc + s.duration, 0);
    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);

    const booking = this.bookingRepo.create({
      barber: { id: dto.barberId },
      client: { id: dto.clientId },
      services,
      startTime,
      endTime,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepo.save(booking);
  }

  async findAll() {
    return this.bookingRepo.find({
      relations: ['barber', 'client', 'services'],
      order: { startTime: 'DESC' },
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    
    booking.status = status;
    return this.bookingRepo.save(booking);
  }
}