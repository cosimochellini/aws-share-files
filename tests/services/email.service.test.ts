import { beforeEach, describe, expect, it, vi } from 'vitest';

import { email } from '../../src/services/email.service';
import { transporter } from '../../src/instances/transporter';
import { bucket } from '../../src/services/bucket.service';

const sendMail = vi.mocked(transporter.sendMail);

describe('email.sendFile', () => {
  beforeEach(() => {
    vi.spyOn(bucket, 'getShareableUrl').mockResolvedValue('https://signed.example.test/file');
    sendMail.mockResolvedValue({ messageId: 'test-message-id' } as never);
  });

  it('signs the file for one second and mails it as an attachment', async () => {
    await email.sendFile({ to: 'someone@example.test', fileKey: 'author/book.pdf' });

    expect(bucket.getShareableUrl).toHaveBeenCalledWith({ key: 'author/book.pdf', expires: 1 });

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'someone@example.test',
        from: 'Test App <noreply@example.test>',
        attachments: [
          {
            path: 'https://signed.example.test/file',
            filename: 'book.pdf',
            contentType: 'application/pdf',
          },
        ],
      }),
    );
  });

  it('returns whatever the transporter resolves with', async () => {
    const result = await email.sendFile({ to: 'a@example.test', fileKey: 'author/book.pdf' });

    expect(result).toEqual({ messageId: 'test-message-id' });
  });
});
