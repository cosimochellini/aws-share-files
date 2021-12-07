type Props = {
  statusCode: number;
  statusMessage: string;
};

function Error({ statusCode, statusMessage }: Props) {
  return (
    <div>
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
      <p>{statusMessage}</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: any): Props => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const statusMessage = res
    ? res.statusMessage
    : err
    ? err.statusMessage
    : "Not Found";

  return { statusCode, statusMessage };
};

export default Error;
