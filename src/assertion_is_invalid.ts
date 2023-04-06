export class AssertionIsInvalid extends Error {

  constructor(assertionMsg: string | undefined) {

    super(assertionMsg);

    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AssertionIsInvalid.prototype);
  }
}
