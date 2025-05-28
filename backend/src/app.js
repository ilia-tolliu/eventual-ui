import { randomInt, randomUUID } from "crypto";
import { BusinessError } from "./errors.js";

const ACCOUNT_OPENED_EVENT = "account_opened";
const FUNDS_DEPOSITED_EVENT = "funds_deposited";
const FUNDS_WITHDRAWN_EVENT = "funds_withdrawn";

export class App {
  #eventStore;
  #balanceProjection;
  #accountProjection;

  constructor() {
    const initialEvent = {
      eventType: ACCOUNT_OPENED_EVENT,
      revision: 1,
      createdAt: new Date().toISOString(),
      accountNo: accountNo(),
    };

    this.#eventStore = [];
    this.#publishEvent(initialEvent, true);
    this.#accountProjection = initialEvent.accountNo;
  }

  handleHealthCheck(req) {
    return {
      time: new Date().toISOString(),
    };
  }

  handleGetAccount(req) {
    return {
      accountNo: this.#accountProjection,
    };
  }

  handleGetBalance(req) {
    const expectedRevision = req.query["expected_revision"];

    if (expectedRevision) {
      assertRevision(expectedRevision, this.#balanceProjection.revision);
    }

    return this.#balanceProjection;
  }

  handlePostDeposit(req) {
    const { amount, expectedRevision } = req.body;

    const balance = this.#balance();
    assertRevision(balance.revision, expectedRevision);

    const event = {
      eventType: FUNDS_DEPOSITED_EVENT,
      revision: balance.revision + 1,
      amount,
      createdAt: now(),
    };

    this.#publishEvent(event);

    return {
      revision: event.revision,
    };
  }

  handlePostWithdraw(req) {
    const { amount, expectedRevision } = req.body;

    const balance = this.#balance();
    assertRevision(balance.revision, expectedRevision);

    if (balance.amount < amount) {
      throw new BusinessError(
        "Not enough funds; please try again with less amount",
      );
    }

    const event = {
      eventType: FUNDS_WITHDRAWN_EVENT,
      revision: balance.revision + 1,
      amount,
      createdAt: now(),
    };

    this.#publishEvent(event);

    return {
      revision: event.revision,
    };
  }

  #balance() {
    const state = {
      amount: 0,
      revision: 0,
      updatedAt: "",
    };

    for (const event of this.#eventStore) {
      switch (event.eventType) {
        case ACCOUNT_OPENED_EVENT: {
          break;
        }
        case FUNDS_DEPOSITED_EVENT: {
          state.amount = state.amount + event.amount;
          break;
        }
        case FUNDS_WITHDRAWN_EVENT: {
          state.amount = state.amount - event.amount;
          break;
        }
        default:
          throw new Error(`Unsupported event type: [${event.eventType}]`);
      }
      state.revision = event.revision;
      state.updatedAt = event.createdAt;
    }

    return state;
  }

  #publishEvent(event, immediately) {
    this.#eventStore.push(event);
    console.log("events", JSON.stringify(this.#eventStore, null, "  "));

    const timeout = immediately ? 0 : randomInt(3000, 7000);
    setTimeout(() => (this.#balanceProjection = this.#balance()), timeout);
  }
}

function accountNo() {
  const lowPart = randomInt(100, 999);
  const highPart = randomInt(100, 999);

  return `${lowPart}-${highPart}`;
}

function now() {
  return new Date().toISOString();
}

function assertRevision(actual, expected) {
  if (String(actual) != String(expected)) {
    throw new BusinessError("Outdated state; please refetch");
  }
}
