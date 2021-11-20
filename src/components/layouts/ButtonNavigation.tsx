import Link from "../Link";
import { useRouter } from "next/router";
import { navbarItems } from "../../instances/navbar";
import { forwardRef, useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

export default function ButtonNavigation() {
  const router = useRouter();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const { pathname } = router;

    const index =
      navbarItems.findIndex((item) => item.redirect === pathname) ?? 0;

    setValue(index);
  }, [router]);

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
      >
        {navbarItems
          .filter((x) => x.bottomNav)
          .map((item, index) => (
            <BottomNavigationAction
              // eslint-disable-next-line react/display-name
              component={forwardRef((prop, ref) => (
                <Link key={item.name} href={item.redirect} {...prop} />
              ))}
              key={index}
              label={item.name}
              icon={item.icon}
            />
          ))}
      </BottomNavigation>
    </Paper>
  );
}
