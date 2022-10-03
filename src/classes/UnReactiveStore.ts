import { device } from '../services/device.service';

export class UnReactiveStore<T> {
  private _key: string;

  private _initialValue: T;

  constructor(key: string, initialValue: T) {
    this._key = key;
    this._initialValue = initialValue;
  }

  public get value() {
    try {
      // Get from local storage by key
      const item = device.window?.localStorage.getItem(this._key);

      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : this._initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return this._initialValue;
    }
  }

  public set(value: T) {
    try {
      device.window?.localStorage.setItem(this._key, JSON.stringify(value));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error);
    }
  }
}
