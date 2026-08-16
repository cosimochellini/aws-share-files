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
                // the component below renders an anchor, not a native <button>; MUI 9
                // needs to be told so it keeps the keyboard and disabled handling right
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
