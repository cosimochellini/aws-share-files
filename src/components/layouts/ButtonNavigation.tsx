import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { navbarItems } from "../../instances/navbar";

export default function ButtonNavigation() {
  const [value, setValue] = useState(0);

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
              key={index}
              label={item.name}
              icon={item.icon}
            />
          ))}
      </BottomNavigation>
    </Paper>
  );
}
