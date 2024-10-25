const request = require('supertest');
const { createServer } = require('http');
const next = require('next');
const moment = require('moment-timezone');

jest.mock('../utils/db', () => {
    const SequelizeMock = require('sequelize-mock'); // Moved inside the jest.mock block
    const dbMock = new SequelizeMock();
    return { sequelize: dbMock };
});

const Contact = require('../models/contact'); // Ensure the correct path

// Mocking the Contact model
jest.mock('../models/contact');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

beforeAll(async () => {
  await app.prepare();
});

describe('Contact API', () => {
  let server;

  beforeEach((done) => {
    server = createServer((req, res) => handle(req, res));
    server.listen(3001, (err) => {
      if (err) throw err;
      done();
    });
  });

  afterEach((done) => {
    if (server) {
      server.close(done);
    }
    Contact.findAll.mockClear(); // Clear mocks after each test
  });
  

  it('should retrieve contacts', async () => {
    const mockContacts = [
      { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: '2023-01-01T00:00:00Z' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', createdAt: '2023-01-10T00:00:00Z' },
    ];

    Contact.findAll.mockResolvedValue(mockContacts);

    const res = await request(server)
      .get('/api/contacts')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.length).toBe(mockContacts.length);
    expect(res.body).toEqual(mockContacts);
  });

  it('should filter contacts by date range', async () => {
    const mockContacts = [
      { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: '2023-01-01T00:00:00Z' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', createdAt: '2023-01-10T00:00:00Z' },
    ];

    Contact.findAll.mockResolvedValue(mockContacts);

    const res = await request(server)
      .get('/api/contacts?startDate=2023-01-01&endDate=2023-01-31')
      .expect(200);

    expect(res.body.length).toBe(2);
    expect(Contact.findAll).toHaveBeenCalledWith({
      where: {
        createdAt: { [Op.between]: [new Date('2023-01-01'), new Date('2023-01-31')] },
      },
      raw: true,
    });
  });

  it('should convert the createdAt timestamp to the user\'s timezone', async () => {
    const mockContacts = [
      { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: '2023-01-01T00:00:00Z' },
    ];

    Contact.findAll.mockResolvedValue(mockContacts);

    const timezone = 'America/New_York';
    const res = await request(server)
      .get(`/api/contacts?timezone=${timezone}`)
      .expect(200);

    const expectedDate = moment('2023-01-01T00:00:00Z').tz(timezone).format();

    expect(res.body[0].createdAt).toBe(expectedDate);
  });
});
