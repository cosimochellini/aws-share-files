import { useRouter } from 'next/router';
import { forwardRef, useMemo, useState } from 'react';
import Link from '../Link';
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
            .map((item, index) => (
              <BottomNavigationAction
                component={forwardRef((prop, ref) => (
                  <Link
                    {...prop}
                    ref={ref as any}
                    key={item.name}
                    href={item.redirect}
                  />
                ))}
                key={index}
                label={item.name}
                icon={item.icon}
              />
            ))}
        </BottomNavigation>
      </Paper>
    </>
  );
}
