import { PluginsProvider } from "../PluginsProvider";
import sendMessageToWorker from "@/lib/plugins/sendMessageToWorker";
import { render, screen, waitFor } from "@testing-library/react";

describe("PluginsProvider", () => {
  let worker;
  let plugins;
  let event;
  let hook;

  beforeEach(() => {
    worker = {
      addEventListener: jest.fn(),
      postMessage: jest.fn(),
      terminate: jest.fn(),
    };

    plugins = [
      {
        name: "Plugin1",
        code: "console.log('Plugin1')",
      },
      {
        name: "Plugin2",
        code: "console.log('Plugin2')",
      },
    ];

    event = jest.fn();

    hook = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("PluginsProvider component", () => {
    it("renders its children", () => {
      render(
        <PluginsProvider>
          <div
            data-testid="test"
          >
            Test
          </div>
        </PluginsProvider>
      )

      expect(screen.queryByTestId(
        "test"
      )).toBeInTheDocument();
    });

    it("loads plugins and sets initialized state to true", async () => {
      sendMessageToWorker.mockImplementation(() => Promise.resolve());

      render(
        <PluginsProvider>
          <div
            data-testid="test"
          >
            Test
          </div>
        </PluginsProvider>
      )

      await waitFor(() => {
        expect(sendMessageToWorker).toHaveBeenCalledTimes(2);
      });

      expect(sendMessageToWorker).toHaveBeenCalledWith(expect.objectContaining({
        type: "load_plugin",
        successType: "plugin_loaded",
        payload: {
          plugin_name: "Plugin1",
          plugin_code: "console.log('Plugin1')",
        },
      }));

      expect(sendMessageToWorker).toHaveBeenCalledWith(expect.objectContaining({
        type: "load_plugin",
        successType: "plugin_loaded",
        payload: {
          plugin_name: "Plugin2",
          plugin_code: "console.log('Plugin2')",
        },
      }));
    });
  });
});