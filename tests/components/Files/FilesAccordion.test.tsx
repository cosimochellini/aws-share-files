import type { _Object } from '@aws-sdk/client-s3';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { S3File } from '../../../src/classes/S3File';
import { FilesAccordion } from '../../../src/components/Files/FilesAccordion';

vi.mock('../../../src/instances/functions', () => ({
  functions: {
    s3: {
      deleteFile: vi.fn().mockResolvedValue(undefined),
      shareableUrl: vi.fn().mockResolvedValue('https://example.test/signed'),
    },
  },
}));

vi.mock('../../../src/utils/downloadHelper', () => ({
  downloadURI: vi.fn(),
}));

vi.mock('../../../src/store/files.store', () => ({
  useRefreshFolders: () => vi.fn().mockResolvedValue(undefined),
}));

// vitest runs with globals: false, so Testing Library's auto-cleanup is never registered
// and a rendered tree would otherwise leak into the next test
afterEach(cleanup);

const file = new S3File({ Key: 'author/book.pdf', Size: 1234 } as _Object);

describe('FilesAccordion', () => {
  it('never nests a button inside AccordionSummary\'s root button', () => {
    const { container } = render(<FilesAccordion currentFile={file} />);

    expect(container.querySelectorAll('button button')).toHaveLength(0);
  });

  it('still toggles the details panel when the summary is clicked', () => {
    render(<FilesAccordion currentFile={file} />);

    expect(screen.queryByText('Send file via email')).toBeNull();

    fireEvent.click(screen.getByText(/book/));

    expect(screen.getByText('Send file via email')).toBeTruthy();
  });

  it('does not toggle the panel when the delete icon is clicked', () => {
    render(<FilesAccordion currentFile={file} />);

    fireEvent.click(screen.getByTestId('DeleteIcon').closest('button') as HTMLButtonElement);

    expect(screen.queryByText('Send file via email')).toBeNull();
  });

  it('does not toggle the panel when the download icon is clicked', () => {
    render(<FilesAccordion currentFile={file} />);

    fireEvent.click(screen.getByTestId('DownloadIcon').closest('button') as HTMLButtonElement);

    expect(screen.queryByText('Send file via email')).toBeNull();
  });
});
