import { notification } from '../instances/notification';
import { device } from '../services/device.service';

export class UnReactiveStore<T> {
  readonly #key: string;

  readonly #initialValue: T;

  constructor(key: string, initialValue: T) {
    this.#key = key;
    this.#initialValue = initialValue;
  }

  public get value() {
    try {
      // Get from local storage by key
      const item = device.window?.localStorage.getItem(this.#key);

      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : this.#initialValue;
    } catch (error) {
      // If error also return initialValue
      notification.error(error);
      return this.#initialValue;
    }
  }

  public set(value: T) {
    try {
      device.window?.localStorage.setItem(this.#key, JSON.stringify(value));
    } catch (error) {
      // A more advanced implementation would handle the error case
      notification.error(error);
    }
  }
}
