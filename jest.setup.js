import '@testing-library/jest-dom/extend-expect'

const mockPlugins = [
  {
    name: "Plugin1",
    code: "console.log('Plugin1')",
  },
  {
    name: "Plugin2",
    code: "console.log('Plugin2')",
  },
];

jest.mock("dexie-react-hooks", () => ({
  useLiveQuery: jest.fn().mockReturnValue(mockPlugins),
}));

jest.mock('Dexie', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      version: jest.fn().mockImplementation(() => {
        return {
          stores: jest.fn().mockImplementation(() => {
            return {
              delete: jest.fn(),
            };
          }),
          plugins: {
            add: jest.fn(),
            toArray: jest.fn().mockImplementation(() => {
              return mockPlugins;
            }),
          },
        };
      }),
    };
  }),
}))

jest.mock("./lib/plugins/sendMessageToWorker", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
}));

class MockWorker {
  constructor() {
    this.onmessage = () => {};
  }

  postMessage(data) {
    this.onmessage({ data: { type: "message", data } });
  }

  terminate() {
    return true;
  }
}

global.Worker = MockWorker;