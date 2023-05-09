const Graphite = {
  set: function(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const parentKey = keys.join('.');
    const parentValue = this.get(parentKey);

    if (Array.isArray(parentValue)) {
      parentValue[lastKey] = value;
      this.set(parentKey, parentValue);
    } else if (typeof parentValue === 'object' && parentValue !== null) {
      parentValue[lastKey] = value;
      this.set(parentKey, parentValue);
    } else {
      const newValue = { [lastKey]: value };
      this.set(parentKey, newValue);
    }
  },

  get: function(key) {
    const keys = key.split('.');
    let value = JSON.parse(localStorage.getItem(keys[0]));

    if (!value) {
      return null;
    }

    for (let i = 1; i < keys.length; i++) {
      if (value.hasOwnProperty(keys[i])) {
        value = value[keys[i]];
      } else {
        return null;
      }
    }

    return value;
  },

  push: function(key, ...values) {
    const array = this.get(key);
    if (Array.isArray(array)) {
      array.push(...values);
      this.set(key, array);
      return array;
    }
    return null;
  },

  pull: function(key, ...values) {
    const array = this.get(key);
    if (Array.isArray(array)) {
      const newArray = array.filter(item => !values.includes(item));
      this.set(key, newArray);
      return newArray;
    }
    return null;
  },

  has: function(key, value) {
    const array = this.get(key);
    if (Array.isArray(array)) {
      return array.includes(value);
    }
    return false;
  },

  delete: function(key) {
    const value = this.get(key);
    localStorage.removeItem(key);
    return value;
  },

  add: function(key, amount) {
    const value = this.get(key);
    if (typeof value === 'number') {
      const newValue = value + amount;
      this.set(key, newValue);
      return newValue;
    }
    return null;
  },

  sub: function(key, amount) {
    const value = this.get(key);
    if (typeof value === 'number') {
      const newValue = value - amount;
      this.set(key, newValue);
      return newValue;
    }
    return null;
  },
};

window.addEventListener('GraphiteStorageEvent', function(event) {
  const { key, value } = event.detail;
  localStorage.setItem(key, JSON.stringify(value));
});

window.Graphite = Graphite;
