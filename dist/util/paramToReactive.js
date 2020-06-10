"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composition_api_1 = require("@vue/composition-api");
function paramToReactive(param) {
    if (composition_api_1.isRef(param)) {
        return param;
    }
    else if (typeof param === 'function') {
        return composition_api_1.computed(param);
    }
    else if (param) {
        return composition_api_1.reactive(param);
    }
    else {
        return param;
    }
}
exports.paramToReactive = paramToReactive;
//# sourceMappingURL=paramToReactive.js.map