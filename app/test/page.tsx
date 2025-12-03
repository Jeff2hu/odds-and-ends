import React from "react";

const Test = ({ test1, test2 }: { test1: string; test2: string }) => {
  return (
    <div className="w-screen h-screen">
      <div className="text-red-500">{test1}</div>
      <div className="text-blue-500">{test2}</div>
    </div>
  );
};

export default Test;
