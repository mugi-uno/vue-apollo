"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composition_api_1 = require("@vue/composition-api");
function paramToRef(param) {
    if (composition_api_1.isRef(param)) {
        return param;
    }
    else if (typeof param === 'function') {
        return composition_api_1.computed(param);
    }
    else {
        return composition_api_1.ref(param);
    }
}
exports.paramToRef = paramToRef;
//# sourceMappingURL=paramToRef.js.map