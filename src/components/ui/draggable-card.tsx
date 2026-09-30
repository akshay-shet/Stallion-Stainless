"use client";
import { cn } from "@/lib/utils";
import React, { useRef, createContext, useContext } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationControls,
  type PanInfo,
} from "motion/react";

const ContainerContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export const DraggableCardContainer = ({
  className,
  children,
  style,
}: {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <ContainerContext.Provider value={containerRef}>
      <div
        ref={containerRef}
        style={style}
        className={cn("[perspective:3000px] relative overflow-hidden", className)}
      >
        {children}
      </div>
    </ContainerContext.Provider>
  );
};

export const DraggableCardBody = ({
  className,
  children,
  dragConstraints,
  dragElastic = 0.08,
  dragMomentum = true,
  initialRotate = 0,
  style,
  onClick,
}: {
  className?: string;
  children?: React.ReactNode;
  dragConstraints?: React.RefObject<any> | { top?: number; left?: number; right?: number; bottom?: number } | false;
  dragElastic?: number | boolean;
  dragMomentum?: boolean;
  initialRotate?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const contextContainerRef = useContext(ContainerContext);
  const effectiveConstraints = dragConstraints !== undefined ? dragConstraints : (contextContainerRef ?? false);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [20, -20]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-20, 20]),
    springConfig,
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.92, 1, 0.92]),
    springConfig,
  );

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.15, 0, 0.15]),
    springConfig,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isDraggingRef = useRef(false);

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={effectiveConstraints}
      dragElastic={dragElastic}
      dragMomentum={dragMomentum}
      onClick={(e) => {
        if (!isDraggingRef.current && onClick) {
          onClick();
        }
      }}
      initial={{ rotate: initialRotate }}
      onDragStart={() => {
        isDraggingRef.current = true;
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(_event: unknown, _info: PanInfo) => {
        document.body.style.cursor = "default";
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 150);

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });
      }}
      style={{
        rotateX,
        rotateY,
        opacity,
        willChange: "transform",
        ...style,
      }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "rounded-sm bg-white p-4 shadow-md hover:shadow-xl transform-3d select-none cursor-grab active:cursor-grabbing border border-stainless-silver",
        className,
      )}
    >
      {children}
      <motion.div
        style={{
          opacity: glareOpacity,
        }}
        className="pointer-events-none absolute inset-0 bg-white/30 rounded-sm select-none"
      />
    </motion.div>
  );
};
