import { useRouter } from 'next/router';
import { forwardRef, useMemo } from 'react';

import { Link } from '../Link';
import {
  styled,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '../../barrel/mui.barrel';
import { navbarItems, Visibility } from '../../instances/navbar';

export default function ButtonNavigation() {
  const router = useRouter();
  const currentRoute = useMemo(() => {
    const { pathname } = router;

    const index = navbarItems.findIndex((item) => item.redirect === pathname) ?? 0;

    return index;
  }, [router]);

  const BottomDiv = styled('div')({
    marginBottom: '60px',
  });

  return (
    <>
      <BottomDiv />
      <Paper
        sx={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
        }}
        variant="outlined"
      >
        <BottomNavigation showLabels value={currentRoute}>
          {navbarItems
            .filter((x) => [Visibility.All, Visibility.BottomBar].includes(x.visibility))
            .map((item) => (
              <BottomNavigationAction
                // eslint-disable-next-line react/no-unstable-nested-components, react/display-name
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
            ))}
        </BottomNavigation>
      </Paper>
    </>
  );
}
