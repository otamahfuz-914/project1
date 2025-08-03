// PuterVision v0.1
// A library for interacting with the device's hardware, such as camera and microphone.

(function (window) {
    if (!window.puter) {
        window.puter = {};
    }

    const puterVision = {
        _requests: {},

        /**
         * Initializes a connection with the parent frame for permission requests.
         */
        _init: function () {
            window.addEventListener('message', (event) => {
                if (event.data.type === 'puter-permission-response') {
                    const requestId = event.data.requestId;
                    if (this._requests[requestId]) {
                        if (event.data.error) {
                            this._requests[requestId].reject(new Error(event.data.error));
                        } else {
                            this._requests[requestId].resolve(event.data.data);
                        }
                        delete this._requests[requestId];
                    }
                }
            });
        },

        /**
         * Requests permission to use a device feature (e.g., 'camera').
         * @param {string} permission - The name of the permission to request.
         * @returns {Promise<boolean>} - A promise that resolves with `true` if permission is granted, `false` otherwise.
         */
        requestPermission: function (permission) {
            return new Promise((resolve, reject) => {
                const requestId = this._generateRequestId();
                this._requests[requestId] = { resolve, reject };
                window.parent.postMessage({
                    type: 'puter-permission-request',
                    permission: permission,
                    requestId: requestId
                }, '*');
            });
        },
        
        /**
         * Opens the device camera to take a picture.
         * @returns {Promise<string>} A promise that resolves with the base64 encoded image data.
         */
        takePicture: function() {
            return new Promise((resolve, reject) => {
                const requestId = this._generateRequestId();
                this._requests[requestId] = { resolve, reject };
                window.parent.postMessage({
                    type: 'puter-camera-request',
                    requestId: requestId,
                }, '*');
            });
        },

        /**
         * Generates a unique ID for each request.
         * @returns {string} A unique request ID.
         */
        _generateRequestId: function () {
            return 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        }
    };

    puterVision._init();
    window.puter.vision = puterVision;

})(window);
