
import app from '../applicaiton/application.js';
import request from 'supertest';
import { expect } from 'chai';

describe("GET /cloud/healthz", () => {
  it("It should respond 200", (done) => { // Use the 'done' callback
    request(app)
      .get("/cloud/healthz")
      .end((err, response) => {
        if (err) {
          done(err); // Pass the error to 'done'
        } else {
          expect(response.statusCode).equal(200);
          done(); // Indicate that the test is done
        }
      });
  });
});