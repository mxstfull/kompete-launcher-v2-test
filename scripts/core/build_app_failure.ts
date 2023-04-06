export class BuildAppFailure extends Error {

  constructor(
    {
      msg,
    }: {
      msg: string;
    },
  ) {

    super(msg);

    this.name = this.constructor.name;
    Object.setPrototypeOf(this, BuildAppFailure.prototype);
  }
}
