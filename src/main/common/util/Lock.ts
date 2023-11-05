class Lock {
  private _locked = false;

  private _waiting: Array<() => void> = [];

  lock() {
    return new Promise<void>(resolve => {
      if (!this._locked) {
        this._locked = true;
        resolve();
      } else {
        this._waiting.push(resolve);
      }
    });
  }

  unlock() {
    if (this._waiting.length > 0) {
      const nextResolve = this._waiting.shift();
      if (nextResolve) {
        nextResolve();
      }
    } else {
      this._locked = false;
    }
  }
}

export const lock = new Lock();
