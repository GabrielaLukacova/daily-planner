"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRequest = void 0;
const mockRequest = (data) => {
    return Object.assign({ body: {}, params: {}, query: {} }, data);
};
exports.mockRequest = mockRequest;
//# sourceMappingURL=mockRequest.js.map