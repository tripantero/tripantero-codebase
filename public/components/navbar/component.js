module.exports = class {
  onCreate() {
    this.state = {
      isLoggedIn: false,
      isOpen: false
    };
  }

  openNav() {
    this.state.isOpen = !this.state.isOpen;
  }
};
