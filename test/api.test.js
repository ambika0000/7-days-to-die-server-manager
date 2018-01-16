var supertest = require('supertest');
var assert = require('assert');

describe('API @api', function () {
  describe('SdtdServer', function () {
    describe('/api/sdtdserver/togglelogging', function () {
      it('Changes logging status', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/toggleLogging')
          .query({
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      })
    })

    describe('GET /api/sdtdserver/players', function () {
      it('Should return JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/players')
          .query({
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
      it('Should return an array', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/players')
          .query({
            serverId: sails.testServer.id
          })
          .then(response => {
            assert.equal(typeof response.body, typeof new Array);
            done();
          })
          .catch(err => {
            done(err);
          });
      });
      it('Should error when no serverID given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/players')
          .expect(400, done);
      });
    });

    describe('GET /api/sdtdserver/info', function () {
      it('Should return JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/info')
          .query({
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

      it('Should error when no serverID given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/info')
          .expect(400, done);
      });

      it('Should not have any sensitive information', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/info')
          .query({
            serverId: sails.testServer.id
          })
          .expect(200)
          .then(response => {
            if (!_.isUndefined(response.body.telnetPort)) {
              return done(new Error('Response contains the telnet port!'));
            }
            if (!_.isUndefined(response.body.telnetPassword)) {
              return done(new Error('Response contains the telnet password!'));
            }
            if (!_.isUndefined(response.body.authName)) {
              return done(new Error('Response contains the authName!'));
            }
            if (!_.isUndefined(response.body.authToken)) {
              return done(new Error('Response contains the authToken!'));
            }
            return done();
          })
          .catch(err => {
            done(err);
          });
      });
    });
  })
  describe('Player', function () {
    describe('GET /api/player/ban @api', function () {
      it('should return OK (200)', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect(200, done);
      });
      it('should return JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/, done);
      });
      it('should return info about ban status', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .then(response => {
            if (_.isUndefined(response.body.banned)) {
              return done('Did not find ban status information');
            }
            done();
          });
      });
      it('should error when no steamId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            serverId: sails.testServer.id
          })
          .expect(400, done);
      });
      it('should error when no serverId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            steamId: sails.testUser.steamId,
          })
          .expect(400, done);
      });
    });
    describe('GET /api/player/inventory @api', function () {
      it('should return OK (200)', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/inventory')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect(200, done);
      });
      it('should return JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/inventory')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/, done);
      });
      it('should error when no steamId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/inventory')
          .query({
            serverId: sails.testServer.id
          })
          .expect(400, done);
      });
      it('should error when no serverId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/inventory')
          .query({
            steamId: sails.testUser.steamId,
          })
          .expect(400, done);
      });
    });
    describe('GET /api/player/location @api', function () {
      it('should return OK (200)', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect(200, done);
      });
      it('should return JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/, done);
      });
      it('should return info about a players location', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          }).then(response => {
            if (_.isUndefined(response.body.location)) {
              return done('Did not find location information');
            }
            if (_.isUndefined(response.body.location.x)) {
              return done('Did not x coordinate information');
            }
            if (_.isUndefined(response.body.location.y)) {
              return done('Did not y coordinate information');
            }
            if (_.isUndefined(response.body.location.z)) {
              return done('Did not z coordinate information');
            }
            done();
          });
      });
      it('should error when no steamId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            serverId: sails.testServer.id
          })
          .expect(400, done);
      });
      it('should error when no serverId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            steamId: sails.testUser.steamId,
          })
          .expect(400, done);
      });
    });

  })
})
