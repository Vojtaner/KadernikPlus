"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositStatusOptions = exports.DepositStatus = void 0;
{
    /* záloha stav - selectfield - depositStatus
     záloha výše - textfield - deposit
     datum - datetimepicker - date
     kadeřnice - autocomplete */
}
{
    /* stav návštěvy*/
}
var DepositStatus;
(function (DepositStatus) {
    DepositStatus["NEZAPLACENO"] = "NEZAPLACENO";
    DepositStatus["ZAPLACENO"] = "ZAPLACENO";
    DepositStatus["BEZ_ZALOHY"] = "BEZ Z\u00C1LOHY";
})(DepositStatus || (exports.DepositStatus = DepositStatus = {}));
exports.depositStatusOptions = Object.entries(DepositStatus).map(([key, value]) => ({
    id: key,
    name: value,
}));
