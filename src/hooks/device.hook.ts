import { useState } from 'react';

import { noop } from '../utils/noop';
import { debounce } from '../utils/callbacks';
import { device } from '../services/device.service';

import { useEffectOnceWhen } from './once';

const initialDeviceState = {
  isClient: false,
  isMobile: false,
  isDarkMode: false,
  isDesktop: false,
  window: null,
  runOnClient: noop,
  hasWidth: () => false,
} as typeof device;

export const useDevice = () => {
  const [state, setState] = useState(initialDeviceState);

  useEffectOnceWhen(() => {
    const handleResize = debounce(() => {
      setState({ ...device, hasWidth: (x) => device.hasWidth(x) });
    });

    window.addEventListener('resize', () => handleResize());

    handleResize();

    return () => window.removeEventListener('resize', () => handleResize());
  });

  return state;
};
