import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';
import {
  cleanup, fireEvent, render, screen,
} from '@testing-library/react';

import { SendFileViaEmail } from '../../src/components/Files/SendFileViaEmail';
import { useEmailsStore } from '../../src/store/emails.store';
import type { UserEmail } from '../../src/types/dynamo.types';

const email = (address: string, isDefault = false): UserEmail => ({
  pk: 'user',
  sk: address,
  user: 'user',
  email: address,
  description: address.split('@')[0] ?? address,
  default: isDefault,
});

// vitest runs with globals: false, so Testing Library's auto-cleanup is never registered
// and a rendered tree would otherwise leak into the next test
afterEach(cleanup);

beforeEach(() => {
  useEmailsStore.setState({
    emails: [email('ada@example.test', true), email('grace@example.test')],
  });
});

// the trigger is the summary list row, not a button
const openMenu = () => {
  const trigger = screen.getByText('ada').closest('li');

  if (!trigger) throw new Error('could not find the menu trigger');

  fireEvent.click(trigger);
};

describe('SendFileViaEmail', () => {
  it('lets MenuList drive the roving tabindex across the email options', async () => {
    // MenuList clones its children to inject tabIndex/autoFocus. EmailMenuItem wraps
    // MenuItem, so it has to forward what it is handed or none of this reaches the DOM.
    render(<SendFileViaEmail fileKey="books/dune.epub" />);

    openMenu();

    const options = await screen.findAllByRole('menuitem');

    expect(options).toHaveLength(2);

    // exactly one item is reachable by Tab; the rest are reached with the arrow keys
    const tabbable = options.filter((option) => option.getAttribute('tabindex') === '0');

    expect(tabbable).toHaveLength(1);
    expect(options.every((option) => option.hasAttribute('tabindex'))).toBe(true);
  });

  it('renders one option per stored email, labelled with the address', async () => {
    render(<SendFileViaEmail fileKey="books/dune.epub" />);

    openMenu();

    const options = await screen.findAllByRole('menuitem');

    expect(options.map((option) => option.textContent)).toEqual([
      expect.stringContaining('ada@example.test'),
      expect.stringContaining('grace@example.test'),
    ]);
  });
});

vi.mock('../../src/instances/functions', () => ({
  functions: { email: { sendFile: vi.fn() } },
}));
