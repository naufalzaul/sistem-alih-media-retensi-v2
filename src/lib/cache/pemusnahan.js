export const pemusnahanCache = {
  pages: {},
  ttl: 50 * 1000,

  onUpdate: null,

  get(key) {
    const cached = this.pages[key];
    if (!cached) return null;

    if (Date.now() - cached.updatedAt > cached.ttl) {
      delete this.pages[key];
      this._triggerUpdate();
      return null;
    }

    return cached.data;
  },

  set(key, data, ttl) {
    this.pages[key] = {
      data,
      updatedAt: Date.now(),
      ttl: ttl || this.ttl
    };
    this._triggerUpdate();
  },

  delete(key) {
    delete this.pages[key];
    this._triggerUpdate();
  },

  clear(prefix = 'pemusnahan:') {
    Object.keys(this.pages).forEach((key) => {
      if (key.startsWith(prefix)) delete this.pages[key];
    });
    this._triggerUpdate();
  },

  _triggerUpdate() {
    if (typeof this.onUpdate === 'function') this.onUpdate(this.pages);
  }
};
