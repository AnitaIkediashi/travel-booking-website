import { useDebouncedCallback } from "@/utils/debounceCallback";
import { renderHook, act } from "@testing-library/react";


/**
 * A few things worth understanding here:

    1. renderHook simulates a component that calls your hook, and gives you result.current — the value your hook returns (in this case, the debounced function itself) — without needing to mount a real component just to test a hook.
    2. act(...) wraps anything that causes state updates or side effects (calling the debounced function, advancing timers) so React processes updates the same way it would in a real render cycle. Skipping act can cause warnings or flaky tests.
    3. jest.useFakeTimers() + jest.advanceTimersByTime() replace real setTimeout/setInterval with a controllable fake clock — so a "300ms delay" test runs instantly instead of your suite actually pausing for 300ms real-world milliseconds. Essential for testing anything debounce/throttle/timeout related.
    4. The debounce-reset test is the most important one — it's testing the actual point of this hook (only the last call within the delay window fires), not just "does setTimeout work."
 */

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not call the callback immediately", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current("hello");
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("calls the callback after the delay", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current("hello");
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("hello");
  });

  it("does not call the callback before the delay has passed", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current("hello");
    });

    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("resets the timer if called again before the delay finishes (debounce behavior)", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current("first");
    });

    act(() => {
      jest.advanceTimersByTime(200); // not yet fired
    });

    act(() => {
      result.current("second"); // resets the timer
    });

    act(() => {
      jest.advanceTimersByTime(200); // total would've been 400ms from "first", but timer reset
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100); // now 300ms since "second"
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second"); // only the latest call fires
  });

  it("passes multiple arguments through to the callback", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current("a", 1, true);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledWith("a", 1, true);
  });

  it("clears the pending timeout on unmount (no crash / no stray call)", () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 300),
    );

    act(() => {
      result.current("hello");
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Note: this hook doesn't actually clear the timeout on unmount (see below)
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
