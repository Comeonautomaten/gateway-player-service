const { expect } = require('chai');
const nock = require('nock');

const PlayerService = require('../src');

async function run() {
  nock.disableNetConnect();

  const gatewayUrl = 'https://gateway.test';

  const payloadMatcher = body => {
    expect(body).to.have.property('franchiseCode', 'SWEDEN_COMEON');
    expect(body).to.have.property('password', 'Test123!');
    expect(body).to.have.property('username');
    expect(body).to.have.property('personalNumber');
    expect(body).to.have.nested.property('lossLimits.dailyLimit');
    expect(body).to.have.nested.property('spendingLimits.monthlyLimit', '700');
    expect(body).to.have.property('balanceLimit', '500');
    return true;
  };

  const scope = nock(gatewayUrl)
    .post('/player/', payloadMatcher)
    .reply(200, {
      playerId: '123456',
      username: 'swed_user_1',
      email: 'swed_user_1@example.com',
      sessionId: 'SESSIONKEY'
    });

  const service = new PlayerService({
    gatewayUrl
  });

  const player = await service.createPlayer({
    franchiseCode: 'SWEDEN_COMEON'
  });

  expect(player.playerId).to.equal('123456');
  expect(player.username).to.equal('swed_user_1');
  expect(player.email).to.equal('swed_user_1@example.com');
  expect(player.password).to.equal('Test123!');
  expect(player.sessionId).to.equal('SESSIONKEY');

  scope.done();

  console.log('PlayerService POC tests passed');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

