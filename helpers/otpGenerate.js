// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC1f1ac6e84cb6760764c14bd397baed81";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VA0e1da88f7e592dc72b015f024c55ef49";
const client = require("twilio")(accountSid, authToken);

  function sendVerificationCode(phoneNumber) {
   return client.verify.v2.services(verifySid)
     .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" });
 }
 function verifyOTP(phoneNumber, otpCode) {
   return client.verify.v2.services(verifySid)
     .verificationChecks.create({ to: `+91${phoneNumber}`, code: otpCode })
 }

 module.exports = {
   sendVerificationCode,
   verifyOTP,
 }