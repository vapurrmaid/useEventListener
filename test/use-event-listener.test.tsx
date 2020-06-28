import { configure, mount } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import { useDocumentEventListener, useWindowEventListener } from "../src/use-event-listener";

configure({ adapter: new Adapter() });

describe("useWindowEventListener", () => {
  it("works", () => {
    // Given a mocked window and mocked registration of "beforeunload"
    // and "unload" events
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

    window.removeEventListener = jest.fn((event) => {
      if (event === "beforeunload") {
        delete mockedEventRegistration.beforeunload;
      }

      if (event === "unload") {
        delete mockedEventRegistration.unload;
      }
    });

    // Given a component that uses useWindowEventListener
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const HookWrapper: React.FC<{
      someProp: string;
      e: keyof WindowEventMap;
    }> = ({ e, someProp }) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      useWindowEventListener(e, () => {}, [someProp]);
      return <p>{someProp}</p>;
    };

    // When the component mounts with beforeunload
    // Then we have 1 beforeunload listener registered
    const wrapper = mount(<HookWrapper e={"beforeunload"} someProp="Mount" />);
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
    wrapper.setProps({ e: "unload" });
    expect(mockedEventRegistration.beforeunload).toBeUndefined();
    expect(mockedEventRegistration.unload).toBeDefined();

    // When the component unmounts
    // Then the registered listeners are removed
    wrapper.unmount();
    expect(mockedEventRegistration.beforeunload).toBeUndefined();
    expect(mockedEventRegistration.unload).toBeUndefined();
  });
});

describe("useDocumentEventListener", () => {
  it("works", () => {
    // Given a mocked document with a mocked "fullscreenchange" event
    const mockedEventRegistration: {
      fullscreenchange?: unknown;
      fullscreenerror?: unknown;
    } = {};

    document.addEventListener = jest.fn((event, handler) => {
      if (event === "fullscreenchange") {
        mockedEventRegistration.fullscreenchange = handler;
      }

      if (event === "fullscreenerror") {
        mockedEventRegistration.fullscreenerror = handler;
      }
    });

    document.removeEventListener = jest.fn((event) => {
      if (event === "fullscreenchange") {
        delete mockedEventRegistration.fullscreenchange;
      }

      if (event === "fullscreenerror") {
        delete mockedEventRegistration.fullscreenerror;
      }
    });

    // Given a component that uses useDocumentEventListener
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const HookWrapper: React.FC<{
      someProp: string;
      e: keyof DocumentEventMap;
    }> = ({ e, someProp }) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      useDocumentEventListener(e, () => {});
      return <p>{someProp}</p>;
    };

    // When the component mounts with fullscreenchange
    // Then we have 1 fullscreenchange listener registered
    const wrapper = mount(<HookWrapper e={"fullscreenchange"} someProp="Mount" />);
    expect(mockedEventRegistration.fullscreenchange).toBeDefined();
    expect(mockedEventRegistration.fullscreenerror).toBeUndefined();
    expect(wrapper.find("p").text()).toBe("Mount");

    // When the component updates
    // Then we still have 1 fullscreenchange listener registered
    wrapper.setProps({ someProp: "Update" });
    expect(mockedEventRegistration.fullscreenchange).toBeDefined();
    expect(mockedEventRegistration.fullscreenerror).toBeUndefined();
    expect(wrapper.find("p").text()).toBe("Update");

    // When the event type changes from fullscreenchange to fullscreenerror
    // Then fullscreenchange is unregistered and fullscreenerror is registered
    wrapper.setProps({ e: "fullscreenerror" });
    expect(mockedEventRegistration.fullscreenchange).toBeUndefined();
    expect(mockedEventRegistration.fullscreenerror).toBeDefined();

    // When the component unmounts
    // Then the registered listeners are removed
    wrapper.unmount();
    expect(mockedEventRegistration.fullscreenchange).toBeUndefined();
    expect(mockedEventRegistration.fullscreenerror).toBeUndefined();
  });
});
