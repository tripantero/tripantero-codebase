module.exports = class {
  onCreate() {
    this.state = {
      check: false,
      rotation: 0,
      isIconRotated: false
    };
  }

  // Rotates the icon
  rotateIcon(x1, x2) {
    this.state.isIconRotated = !this.state.isIconRotated;
    if (this.state.isIconRotated) {
      this.state.rotation = x1;
    } else {
      this.state.rotation = x2;
    }
  }

  openHistory() {
    this.rotateIcon(-180, 0);
    this.state.check = !this.state.check;
    console.log(this.input.events);
  }

  get events() {
    const {events} = this.input;
    return events;
  }
};
