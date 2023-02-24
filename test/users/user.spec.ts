import { UserFactory } from './../../database/factories/index';
import Database from "@ioc:Adonis/Lucid/Database";
import { UserFactory } from "Database/factories";
import test from "japa"
import supertest from "supertest"

const BASE_URL = `http://127.0.0.1:3333`;

test.group('User', (group) => {
  test('It should create a new user', async (assert) => {
    // assert.isTrue(true);
    const userPayload = { email: 'adriano.freitas@goflux.com.br', username: 'adriano.freitas', password: 'test', avatar: 'http://images.com/image/22' }
    const {body} = await supertest(BASE_URL).post('/users').send(userPayload).expect(201);
    assert.exists(body.user, 'User undefined');
    assert.exists(body.user.id, 'User undefined');
    assert.equal(body.user.email, userPayload.email);
    assert.equal(body.user.username, userPayload.username);
    assert.equal(body.user.password, userPayload.password);
  });
  test('it should return 422 error, when required data is not provider', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/users').send({}).expect(422);
    console.log({body: JSON.stringify(body)})
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);

  });
  test('it should return 422 error, when providing an invalid email', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/users').send({
      email: '',
      password: 'teste',
      username: 'teste.teste1'
    }).expect(422);
    console.log({body: JSON.stringify(body)})
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);

  });
  test('it should return 422 error, when providing an invalid password', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/users').send({
      email: 'teste@test.com',
      password: '',
      username: 'teste.teste'
    }).expect(422);
    console.log({body: JSON.stringify(body)})
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 422);

  });
  test('it should return 409 when username already in use', async (assert) => {
    const {username} = await UserFactory.create();
    const {body} = await supertest(BASE_URL).post('/users').send({
      username,
      email: 'adriano.freitas@goflux.com.br',
      password: 'test'
    }).expect(409);
    assert.exists(body.message);
    assert.exists(body.code);
    assert.exists(body.status);
    // assert.include(body.message,'email');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 409);
  })
  test('it should return 409 when email already in use', async (assert) => {
    const {email} = await UserFactory.create();
    const {body} = await supertest(BASE_URL).post('/users').send({
      email,
      username : 'adriano.freitas',
      password: 'test'
    }).expect(409);
    assert.exists(body.message);
    assert.exists(body.code);
    assert.exists(body.status);
    // assert.include(body.message,'email');
    assert.equal(body.code, 'BAD_REQUEST');
    assert.equal(body.status, 409);
  });

  test.only('it should update an user', async (assert) => {
    const {id, password} = await UserFactory.create();
    const email = 'adriano.freitas@gmail.com';
    const avatar = 'http://github.com/milicofelix.png';
    const {body} = await supertest(BASE_URL).put(`/users/${id}`).send({
      email,
      avatar,
      password
    }).expect(200)
    console.log({body});
    assert.exists(body.user, 'User undefined');
    assert.equal(body.user.email, email);
    assert.equal(body.user.avatar, avatar);
    assert.equal(body.user.id, id);

  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  });
  group.beforeEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
});
