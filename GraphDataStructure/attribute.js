function attribute(key, value) {
  // always initialize all instance properties
  this.key = key;
  this.value = value;
}

// export the class
module.exports = attribute;