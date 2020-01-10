module.exports = class {
  onCreate() {
    this.state = {
      rotation: 0,
      isCollapsed: false,
      isIconRotated: true
    };
  }

  // Rotates the icon
  rotateIcon(x1, x2) {
    this.state.isIconRotated = !this.state.isIconRotated;
    if (!this.state.isIconRotated) {
      this.state.rotation = x1;
    } else {
      this.state.rotation = x2;
    }
  }

  collapseCard() {
    this.rotateIcon(-180, 0);
    this.state.isCollapsed = !this.state.isCollapsed;
  }
};
