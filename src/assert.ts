import { AssertionIsInvalid } from './assertion_is_invalid';

export function assert(
  assertionCondition: boolean,
  assertionMsg?: string,
): asserts assertionCondition {

  if (!assertionCondition) {

    throw new AssertionIsInvalid(assertionMsg);
  }
}
