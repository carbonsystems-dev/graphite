interface Graphite {
  set: (key: string, value: any) => void;
  get: (key: string, callback?: (value: any) => void) => void;
  push: (key: string, ...values: any[]) => any[] | null;
  pull: (key: string, ...values: any[]) => any[] | null;
  has: (key: string, value: any) => boolean;
  delete: (key: string) => any;
  add: (key: string, amount: number) => number | null;
  sub: (key: string, amount: number) => number | null;
}

const Graphite: Graphite = {
  set: function(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));

    const event = new CustomEvent('GraphiteStorageEvent', {
      detail: { key, value },
    });
    window.dispatchEvent(event);
  },

  get: function(key: string, callback?: (value: any) => void): void {
    const value = JSON.parse(localStorage.getItem(key));
    callback && callback(value);
  },

  push: function(key: string, ...values: any[]): any[] | null {
    const array = this.get(key);
    if (Array.isArray(array)) {
      array.push(...values);
      this.set(key, array);
      return array;
    }
    return null;
  },

  pull: function(key: string, ...values: any[]): any[] | null {
    const array = this.get(key);
    if (Array.isArray(array)) {
      const newArray = array.filter(item => !values.includes(item));
      this.set(key, newArray);
      return newArray;
    }
    return null;
  },

  has: function(key: string, value: any): boolean {
    const array = this.get(key);
    if (Array.isArray(array)) {
      return array.includes(value);
    }
    return false;
  },

  delete: function(key: string): any {
    const value = this.get(key);
    localStorage.removeItem(key);
    return value;
  },

  add: function(key: string, amount: number): number | null {
    const value = this.get(key);
    if (typeof value === 'number') {
      const newValue = value + amount;
      this.set(key, newValue);
      return newValue;
    }
    return null;
  },

  sub: function(key: string, amount: number): number | null {
    const value = this.get(key);
    if (typeof value === 'number') {
      const newValue = value - amount;
      this.set(key, newValue);
      return newValue;
    }
    return null;
  },
};

window.addEventListener('GraphiteStorageEvent', function(event: CustomEvent) {
  const { key, value } = event.detail;
  localStorage.setItem(key, JSON.stringify(value));
});

window.Graphite = Graphite;
