import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { BookingStatus } from '../../src/modules/booking/entities/booking.entity';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // GIVEN: A logged in admin/barber
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@crowncuts.com', password: 'Password123!' });
    authToken = loginRes.header['set-cookie'][0];
  });

  describe('POST /bookings', () => {
    it('should create a booking (201)', async () => {
      // WHEN: Valid booking data is sent
      return request(app.getHttpServer())
        .post('/bookings')
        .set('Cookie', authToken)
        .send({
          barberId: 'uuid-v4-barber',
          clientId: 'uuid-v4-client',
          serviceIds: ['uuid-v4-service'],
          startTime: new Date(Date.now() + 86400000).toISOString(),
        })
        // THEN: It returns 201 Created
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe(BookingStatus.PENDING);
        });
    });

    it('should return 400 for invalid date', async () => {
      return request(app.getHttpServer())
        .post('/bookings')
        .set('Cookie', authToken)
        .send({ startTime: 'invalid-date' })
        .expect(400);
    });

    it('should return 401 without token', async () => {
      return request(app.getHttpServer())
        .post('/bookings')
        .send({})
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});