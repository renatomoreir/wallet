import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  let senderWalletId: string;
  let receiverWalletId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 🔥 Criar usuário 1
    const senderUser = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name: 'Sender User',
        email: 'sender@test.com',
        password: '123456',
      });

    // 🔥 Criar usuário 2
    const receiverUser = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name: 'Receiver User',
        email: 'receiver@test.com',
        password: '123456',
      });

    const senderUserId = senderUser.body.userId;
    const receiverUserId = receiverUser.body.userId;

    // 🔥 Criar carteira para o usuário 1
    const senderWallet = await request(app.getHttpServer())
      .post('/wallets')
      .send({
        userId: senderUserId,
        balance: 1000,
      });

    // 🔥 Criar carteira para o usuário 2
    const receiverWallet = await request(app.getHttpServer())
      .post('/wallets')
      .send({
        userId: receiverUserId,
        balance: 500,
      });

    senderWalletId = senderWallet.body.walletId;
    receiverWalletId = receiverWallet.body.walletId;
  });

  it('/transactions (POST) deve criar uma transação', async () => {
    const res = await request(app.getHttpServer())
      .post('/transactions/transfer')
      .send({
        senderWalletId,
        receiverWalletId,
        amount: 100,
      })
      .expect(201);

    expect(res.body).toHaveProperty('transactionId');
    expect(res.body.status).toBe('completed');
  });

  afterAll(async () => {
    await app.close();
  });
});
