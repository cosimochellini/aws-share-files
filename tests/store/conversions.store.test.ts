import { beforeEach, describe, expect, it } from 'vitest';

import { useConversionsStore } from '../../src/store/conversions.store';

const initialState = useConversionsStore.getState();

describe('conversions.store', () => {
  beforeEach(() => {
    useConversionsStore.setState({ ...initialState, conversions: [] }, true);
  });

  it('starts with an empty list', () => {
    expect(useConversionsStore.getState().conversions).toEqual([]);
  });

  it('appends a conversion', () => {
    const { addConversion } = useConversionsStore.getState();

    addConversion('first');
    addConversion('second');

    expect(useConversionsStore.getState().conversions).toEqual(['first', 'second']);
  });

  it('dedupes the same id through the Set', () => {
    const { addConversion } = useConversionsStore.getState();

    addConversion('same');
    addConversion('same');
    addConversion('other');
    addConversion('same');

    expect(useConversionsStore.getState().conversions).toEqual(['same', 'other']);
  });

  it('removes a conversion by filtering it out', () => {
    const { addConversion, removeConversion } = useConversionsStore.getState();

    addConversion('a');
    addConversion('b');
    addConversion('c');

    removeConversion('b');

    expect(useConversionsStore.getState().conversions).toEqual(['a', 'c']);
  });

  it('is a no-op when removing an id that is not present', () => {
    const { addConversion, removeConversion } = useConversionsStore.getState();

    addConversion('a');

    removeConversion('missing');

    expect(useConversionsStore.getState().conversions).toEqual(['a']);
  });

  it('is a no-op when removing from an empty list', () => {
    const { removeConversion } = useConversionsStore.getState();

    removeConversion('missing');

    expect(useConversionsStore.getState().conversions).toEqual([]);
  });
});
