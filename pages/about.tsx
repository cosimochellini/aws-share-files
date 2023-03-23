import { Container } from '@mui/material';
import type { GetStaticProps } from 'next';

export const getStaticProps = (async (_) => ({ props: { } })) satisfies GetStaticProps;

const About = () => (
  <Container maxWidth="sm">
    <div>About</div>
  </Container>
);

export default About;
