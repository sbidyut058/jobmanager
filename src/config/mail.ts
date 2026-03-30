import nodemailer, { type Transporter } from 'nodemailer';

export type reqConfigType = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to?: string;
  cc?: string;
  bcc?: string;
}

let transporter: Transporter | null = null;
let config: reqConfigType | null = null;

function validate(cfg: reqConfigType) {
  const requiredFields = ['host', 'port', 'secure', 'user', 'pass', 'from'];
    for (const field of requiredFields) {
        if (!(field in cfg)) {
            throw new Error(`Mail configuration error: missing field "${field}"`);
        }
    }
}

export function initMail(cfg: reqConfigType) {
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
    pool: true,
    maxConnections: 5,
    maxMessages: 100
  });
}

export async function sendMail(options: Omit<nodemailer.SendMailOptions, 'from' | 'to' | 'cc' | 'bcc'>): Promise<void> {
  if (!transporter) return;

  return transporter.sendMail({
    from: config?.from,
    to: config?.to,
    cc: config?.cc,
    bcc: config?.bcc,
    ...options
  });
}
