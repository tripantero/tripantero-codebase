module.exports = class {
    onCreate() {
      this.state = {isOpen: false};
    }
    openNav() {
      this.state.isOpen = !this.state.isOpen;
    }
  };