module.exports = class {
    onCreate() {
        this.state = {
            view: input.view.render({})
        }
    }

    onMount() {
        let rootDiv = document.getElementById("app-root")
        this.state.then(res => console.log(res))
    }
}