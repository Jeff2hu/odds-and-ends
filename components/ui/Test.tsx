"use client";

import React from "react";

const Test = () => {
  console.log("Test");

  React.useEffect(() => {
    console.log("useEffect Test");

    return () => {
      console.log("useEffect cleanup Test");
    };
  }, []);

  return <div>Test</div>;
};

export default Test;
