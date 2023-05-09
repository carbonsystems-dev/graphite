const Graphite = {
  set: function(key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    let currentObject = this.get(keys.join('.'));

    if (!currentObject) {
      currentObject = {};
    } else if (Array.isArray(currentObject)) {
      currentObject = [...currentObject];
    } else {
      currentObject = { ...currentObject };
    }

    currentObject[lastKey] = value;
    localStorage.setItem(keys.join('.'), JSON.stringify(currentObject));

    const event = new CustomEvent('GraphiteStorageEvent', {
      detail: { key: keys.join('.'), value: currentObject },
    });
    window.dispatchEvent(event);
  },

  get: function(key, callback) {
  const keys = key.split('.');
  let value = JSON.parse(localStorage.getItem(keys[0]));

  if (!value) {
    callback(null);
    return;
  }

  for (let i = 1; i < keys.length; i++) {
    if (value.hasOwnProperty(keys[i])) {
      value = value[keys[i]];
    } else {
      callback(null);
      return;
    }
  }

  callback(value);
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
