import nodemailer from 'nodemailer';

let transporter = null;
let config = null;

function validate(cfg) {
  const requiredFields = ['host', 'port', 'secure', 'user', 'pass', 'from'];
    for (const field of requiredFields) {
        if (!(field in cfg)) {
            throw new Error(`Mail configuration error: missing field "${field}"`);
        }
    }
}

export function initMail(cfg) {
  validate(cfg);
  config = Object.freeze(cfg);

  transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass
    },
    pool: true,          // 🔥 important
    maxConnections: 5,
    maxMessages: 100
  });
}

export async function sendMail(options) {
  if (!transporter) return;

  return transporter.sendMail({
    from: config.from,
    to: config.to,
    cc: config.cc,
    bcc: config.bcc,
    ...options
  });
}
