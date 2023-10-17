
import app from '../server.js';
import request from 'supertest';
import { expect } from 'chai';
//xyz

describe("GET /healthz", () => {
  it("It should respond 200", (done) => { // Use the 'done' callback
    request(app)
      .get("/healthz")
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