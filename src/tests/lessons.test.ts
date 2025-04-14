import request from 'supertest';
import app from '../app';

describe('GET /lessons', () => {
  it('should return 200 and an array of lessons with no parameters', async () => {
    const res = await request(app).get('/lessons');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 200 with valid filtering parameters', async () => {
    const res = await request(app).get('/lessons').query({
      date: '2019-09-01,2019-09-10',
      status: '1',
      teacherIds: '1,2',
      studentsCount: '2,5',
      page: '1',
      lessonsPerPage: '5'
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for invalid date format', async () => {
    const res = await request(app).get('/lessons').query({ date: '09-01-2019' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 400 for invalid status value', async () => {
    const res = await request(app).get('/lessons').query({ status: '3' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 400 for non-numeric teacherIds', async () => {
    const res = await request(app).get('/lessons').query({ teacherIds: 'a,b' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 400 for invalid studentsCount format', async () => {
    const res = await request(app).get('/lessons').query({ studentsCount: '5,abc' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should return 200 when only some optional parameters are provided', async () => {
    const res = await request(app).get('/lessons').query({
      status: '0',
      page: '2'
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should correctly handle pagination parameters', async () => {
    const res1 = await request(app).get('/lessons').query({
      page: '1',
      lessonsPerPage: '3'
    });
    const res2 = await request(app).get('/lessons').query({
      page: '2',
      lessonsPerPage: '3'
    });
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(Array.isArray(res1.body)).toBe(true);
    expect(Array.isArray(res2.body)).toBe(true);
    expect(res1.body).not.toEqual(res2.body);
  });
});
