import { useRouter } from 'next/router';
import { forwardRef, useMemo } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Link } from '../Link';
import { navbarItems, Visibility } from '../../instances/navbar';

const ButtonNavigation = () => {
  const router = useRouter();
  const currentRoute = useMemo(() => {
    const { pathname } = router;

    return navbarItems.findIndex((item) => item.redirect === pathname);
  }, [router]);

  const BottomDiv = styled('div')({
    marginBottom: '60px',
  });

  return (
    <>
      <BottomDiv />
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        variant="outlined"
      >
        <BottomNavigation showLabels value={currentRoute}>
          {navbarItems.flatMap((item) => (
            [Visibility.All, Visibility.BottomBar].includes(item.visibility) ? [(
              <BottomNavigationAction
                // BottomNavigationAction hardcodes ButtonBase's internalNativeButton, so
                // MUI 9 warns on every render unless it is told the component below
                // resolves to an anchor. It would also inject role="button", except
                // src/components/Link.tsx drops any incoming role — no loss here, since
                // the rendered <a href> already has native keyboard activation.
                nativeButton={false}
                // eslint-disable-next-line react/no-unstable-nested-components
                component={forwardRef<HTMLAnchorElement>((prop, ref) => (
                  <Link
                    {...prop}
                    ref={ref}
                    key={item.name}
                    href={item.redirect}
                  />
                ))}
                key={item.name}
                label={item.name}
                icon={item.icon}
              />
            )] : []))}
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default ButtonNavigation;
