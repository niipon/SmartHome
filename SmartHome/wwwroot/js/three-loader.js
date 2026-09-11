window.threeHome = {

    module: null,

    async load() {

        if (!this.module) {

            this.module =
                await import(
                    "/js/three-home.js"
                );
        }

        return this.module;
    },

    async init(containerId) {

        const module =
            await this.load();

        module.init(
            containerId
        );
    },

    async update(
        temperature,
        humidity,
        gas,
        motion,
        security
    ) {

        const module =
            await this.load();

        module.updateHomeData(
            temperature,
            humidity,
            gas,
            motion,
            security
        );
    }
};