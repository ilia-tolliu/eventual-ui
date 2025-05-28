export class BusinessError extends Error {
  #clientMessage;

  constructor(clientMessage) {
    super("");
    this.#clientMessage = clientMessage;
  }

  get clientMessage() {
    return this.#clientMessage;
  }
}

export function errorHandlerMiddleware(err, req, res, next) {
  if (err instanceof BusinessError) {
    console.error("BusinessError:", err.clientMessage);

    res.status(409).send({
      error: err.clientMessage,
    });
    return;
  }

  console.error(err.stack);

  res.status(500).send({
    status: 500,
    body: {
      error: "Something went wrong",
    },
  });
}
