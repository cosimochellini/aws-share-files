import Copyright from "../src/components/Copyright";
import { Link, Box, Container, Typography, Button } from "@mui/material";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js v5-beta with TypeScript example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <Button variant="contained" color="error">
          Hello
        </Button>
        <Copyright />
      </Box>
    </Container>
  );
}
