import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWindowWidth } from "../redux/app/features/layout/layoutSlice";

interface WindowDimensions {
  height: number | undefined;
  width: number | undefined;
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowDimensions>({
    width: undefined,
    height: undefined,
  });
  const dispatch = useDispatch();

  function handleResize() {
    console.log("setting window size");
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    dispatch(setWindowWidth(window.innerWidth));
    console.log(window.innerWidth);
  }
  useEffect(() => {
    dispatch(setWindowWidth(window.innerWidth));
    window.addEventListener("resize", handleResize);
    console.log("added window width listener");
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
