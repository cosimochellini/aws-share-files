import Copyright from "../src/components/Copyright";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "../src/components/Link";

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
        <br />
        <Link href="/files" color="secondary">
          Go to the files page
        </Link>
        <br />
        <Button variant="contained" color="error">
          Hello
        </Button>
        <Copyright />
      </Box>
    </Container>
  );
}
