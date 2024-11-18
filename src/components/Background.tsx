import React from 'react';

type BackgroundProps = {
  children: React.ReactNode; // Określa, że `children` może być dowolnym węzłem React.
};

const Background: React.FC<BackgroundProps> = (props) => {
  return (
    <div className="bg-gradient-to-b from-[#2A2035] to-[#6E0BD9] flex flex-col justify-start h-screen overflow-auto">
      {props.children}
    </div>
  );
};

export default Background;
