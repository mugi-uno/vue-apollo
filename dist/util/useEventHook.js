"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function useEventHook() {
    var fns = [];
    function on(fn) {
        fns.push(fn);
        return {
            off: function () { return off(fn); },
        };
    }
    function off(fn) {
        var index = fns.indexOf(fn);
        if (index !== -1) {
            fns.splice(index, 1);
        }
    }
    function trigger(param) {
        for (var _i = 0, fns_1 = fns; _i < fns_1.length; _i++) {
            var fn = fns_1[_i];
            fn(param);
        }
    }
    return {
        on: on,
        off: off,
        trigger: trigger,
    };
}
exports.useEventHook = useEventHook;
//# sourceMappingURL=useEventHook.js.map