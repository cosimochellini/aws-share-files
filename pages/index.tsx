import type { NextPage } from "next";
import { Favorite, ShareOption } from "grommet-icons";
import { Button, Card, CardBody, CardFooter, CardHeader } from "grommet";

const Home: NextPage = ({}) => {
  return (
    <Card round={false}>
      <CardHeader pad="medium">Header</CardHeader>
      <CardBody pad="medium">Body</CardBody>
      <CardFooter pad={{ horizontal: "small" }} background="light-2">
        <Button icon={<Favorite color="red" />} hoverIndicator />
        <Button icon={<ShareOption color="plain" />} hoverIndicator />
      </CardFooter>
    </Card>
  );
};

export default Home;
