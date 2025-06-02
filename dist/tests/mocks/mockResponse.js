"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockResponse = void 0;
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    res.header = jest.fn().mockReturnThis();
    return res;
};
exports.mockResponse = mockResponse;
//# sourceMappingURL=mockResponse.js.map