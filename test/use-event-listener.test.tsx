import { configure, mount } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { useWindowEventListener } from "../src/use-event-listener";

configure({ adapter: new Adapter() });

describe("useWindowEventListener", () => {
  it("works", () => {
    // Given a mocked window with an array of registered events
    const mockedEventRegistration: {
      beforeunload?: unknown;
      unload?: unknown;
    } = {};

    window.addEventListener = jest.fn((event, handler) => {
      if (event === "beforeunload") {
        mockedEventRegistration.beforeunload = handler;
      }

      if (event === "unload") {
        mockedEventRegistration.unload = handler;
      }
    });

    window.removeEventListener = jest.fn((event, handler) => {
      if (event === "beforeunload") {
        delete mockedEventRegistration.beforeunload;
      }

      if (event === "unload") {
        delete mockedEventRegistration.unload;
      }
    });

    let mockEventType: keyof Pick<WindowEventMap, "beforeunload" | "unload"> =
      "beforeunload";

    // Given a component that uses useWindowEventListener
    const HookWrapper: React.FC<{
      someProp: string;
      e: typeof mockEventType;
    }> = ({ e, someProp }) => {
      useWindowEventListener(e, () => {}, [someProp]);
      return <p>{someProp}</p>;
    };

    // When the component mounts with beforeunload
    // Then we have 1 beforeunload listener registered
    const wrapper = mount(<HookWrapper e={mockEventType} someProp="Mount" />);
    expect(mockedEventRegistration.beforeunload).toBeDefined();
    expect(mockedEventRegistration.unload).toBeUndefined();
    expect(wrapper.find("p").text()).toBe("Mount");

    // When the component updates
    // Then we still have 1 beforeunload listener registered
    wrapper.setProps({ someProp: "Update" });
    expect(mockedEventRegistration.beforeunload).toBeDefined();
    expect(wrapper.find("p").text()).toBe("Update");

    // When the event type changes from beforeunload to unload
    // Then beforeunload is unregistered and unload is registered
    mockEventType = "unload";
    wrapper.setProps({ e: mockEventType });
    expect(mockedEventRegistration.beforeunload).toBeUndefined();
    expect(mockedEventRegistration.unload).toBeDefined();

    // When the component unmounts
    // Then the registered listeners are removed
    wrapper.unmount();
    expect(mockedEventRegistration.beforeunload).toBeUndefined();
    expect(mockedEventRegistration.unload).toBeUndefined();
  });
});
