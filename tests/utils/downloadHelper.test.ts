import { describe, expect, it, vi } from 'vitest';

import { downloadURI } from '../../src/utils/downloadHelper';

const stubAnchor = () => {
  const anchor = { download: '', href: '', click: vi.fn() };

  const createElement = vi
    .spyOn(document, 'createElement')
    .mockReturnValue(anchor as unknown as HTMLElement);

  return { anchor, createElement };
};

describe('downloadURI', () => {
  it('creates an anchor, sets download and href, and clicks it', () => {
    const { anchor, createElement } = stubAnchor();

    downloadURI('https://example.test/file.pdf', 'file.pdf');

    expect(createElement).toHaveBeenCalledTimes(1);
    expect(createElement).toHaveBeenCalledWith('a');
    expect(anchor.download).toBe('file.pdf');
    expect(anchor.href).toBe('https://example.test/file.pdf');
    expect(anchor.click).toHaveBeenCalledTimes(1);
  });

  it('never appends the anchor to the document', () => {
    const appendChild = vi.spyOn(document.body, 'appendChild');

    stubAnchor();

    downloadURI('blob:something', 'name');

    expect(appendChild).not.toHaveBeenCalled();
  });

  it('accepts an empty name and uri', () => {
    const { anchor } = stubAnchor();

    downloadURI('', '');

    expect(anchor.download).toBe('');
    expect(anchor.href).toBe('');
    expect(anchor.click).toHaveBeenCalledTimes(1);
  });
});
