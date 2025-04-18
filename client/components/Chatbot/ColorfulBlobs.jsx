import React, { useState, useEffect } from "react";

const AnimatedGlassBlobs = ({
  size = "300px",
  isButton = false,
  isProcessing = false,
}) => {
  const [tick, setTick] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setTick((prev) => prev + 1);
      },
      isProcessing ? 50 : 100
    ); // Faster interval when processing

    return () => clearInterval(interval);
  }, [isProcessing]);

  const getWeirdShape = (base, tick, modifier, active) => {
    const t = tick * (isProcessing ? 0.08 : 0.05); // Faster morphing when processing
    const activeAmplifier = active ? 1.5 : 1;
    const speedAmplifier = isProcessing ? 1.3 : 1; // Additional movement when processing

    const v1 =
      base[0] +
      Math.sin(t + modifier * 0.5) * 60 * activeAmplifier * speedAmplifier;
    const v2 =
      base[1] +
      Math.cos(t * 1.3 + modifier) * 55 * activeAmplifier * speedAmplifier;
    const v3 =
      base[2] +
      Math.sin(t * 0.7 + modifier * 2) * 70 * activeAmplifier * speedAmplifier;
    const v4 =
      base[3] + Math.cos(t * 0.9 + modifier * 1.5) * 65 * activeAmplifier;
    const v5 =
      base[4] + Math.sin(t * 1.1 + modifier * 0.8) * 60 * activeAmplifier;
    const v6 =
      base[5] + Math.cos(t * 0.8 + modifier * 1.2) * 55 * activeAmplifier;
    const v7 =
      base[6] + Math.sin(t * 1.2 + modifier * 0.3) * 65 * activeAmplifier;
    const v8 = base[7] + Math.cos(t * 1.5 + modifier) * 70 * activeAmplifier;

    return `${v1}% ${v2}% ${v3}% ${v4}% ${v5}% ${v6}% ${v7}% ${v8}% / ${v8}% ${v7}% ${v6}% ${v5}% ${v4}% ${v3}% ${v2}% ${v1}%`;
  };

  const containerShape = isProcessing
    ? `${60 + Math.sin(tick * 0.15) * 12}% ${35 + Math.cos(tick * 0.9) * 15}% ${
        45 + Math.sin(tick * 0.2) * 10
      }% ${40 + Math.cos(tick * 0.15) * 12}% / ${
        55 + Math.sin(tick * 0.9) * 15
      }% ${35 + Math.cos(tick * 0.2) * 12}% ${
        65 + Math.sin(tick * 0.15) * 10
      }% ${30 + Math.cos(tick * 0.9) * 15}%`
    : `${60 + Math.sin(tick * 0.06) * 8}% ${40 + Math.cos(tick * 0.08) * 8}% ${
        55 + Math.sin(tick * 0.1) * 8
      }% ${45 + Math.cos(tick * 0.06) * 8}% / ${
        50 + Math.sin(tick * 0.08) * 8
      }% ${45 + Math.cos(tick * 0.1) * 8}% ${55 + Math.sin(tick * 0.06) * 8}% ${
        40 + Math.cos(tick * 0.08) * 8
      }%`;

  const blobs = [
    {
      base: [80, 45, 60, 85, 45, 75, 50, 90],
      width: isButton ? 45 : 180,
      height: isButton ? 45 : 180,
      topBase: 70,
      leftBase: 90,
      moveMod: 1.2,
      colors: "rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.5)",
      zIndex: 50,
    },
    {
      base: [40, 85, 55, 70, 80, 50, 85, 60],
      width: isButton ? 140 : 200,
      height: isButton ? 140 : 200,
      topBase: 70,
      leftBase: 40,
      moveMod: 2.8,
      colors: "rgba(16, 185, 129, 0.5), rgba(99, 102, 241, 0.5)",
      zIndex: 40,
    },
    {
      base: [75, 55, 85, 50, 70, 80, 45, 65],
      width: isButton ? 135 : 160,
      height: isButton ? 135 : 160,
      topBase: 0,
      leftBase: 50,
      moveMod: 1.9,
      colors: "rgba(236, 72, 153, 0.5), rgba(34, 211, 238, 0.5)",
      zIndex: 30,
    },
    {
      base: [75, 55, 85, 50, 70, 80, 45, 65],
      width: isButton ? 135 : 160,
      height: isButton ? 135 : 160,
      topBase: 30,
      leftBase: 100,
      moveMod: 1.9,
      colors: "rgba(236, 102, 103, 0.5), rgba(34, 201, 208, 0.5)",
      zIndex: 30,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: containerShape,
        transition: "border-radius 0.3s ease",
        overflow: isButton ? "visible" : "hidden",
        cursor: isButton ? "pointer" : "default",
      }}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onClick={isButton ? () => console.log("Blob clicked!") : undefined}
    >
      {blobs.map((blob, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: `${blob.width}px`,
            height: `${blob.height}px`,
            top: `calc(${blob.topBase}% - ${blob.height / 2}px + ${
              Math.sin(tick * 0.04 * blob.moveMod) * 20
            }px)`,
            left: `calc(${blob.leftBase}% - ${blob.width / 2}px + ${
              Math.cos(tick * 0.03 * blob.moveMod) * 20
            }px)`,
            background: `linear-gradient(45deg, ${blob.colors})`,
            borderRadius: getWeirdShape(
              blob.base,
              tick,
              blob.moveMod,
              isActive
            ),
            filter: "blur(20px)",
            opacity: 0.85,
            zIndex: blob.zIndex,
            transition: "border-radius 0.01s ease",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedGlassBlobs;
