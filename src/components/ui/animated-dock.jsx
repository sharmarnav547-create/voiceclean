import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

export const AnimatedDock = ({ className, items }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-12 items-end gap-2 rounded-2xl px-3 pb-2",
        "bg-slate-100 dark:bg-white/[0.08]",
        "border border-slate-300 dark:border-white/[0.15]",
        "shadow-md dark:shadow-none",
        className
      )}
    >
      {items.map((item, index) => (
        <DockItem
          key={index}
          mouseX={mouseX}
          label={item.label}
          link={item.link}
          external={item.external}
          target={item.target}
        >
          {item.Icon}
        </DockItem>
      ))}
    </motion.div>
  );
};

const DockItem = ({ mouseX, children, label, link, external, target }) => {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const isActive = !external && pathname === link;

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-120, 0, 120], [32, 56, 32]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const iconScale = useTransform(width, [32, 56], [1, 1.35]);
  const iconSpring = useSpring(iconScale, { mass: 0.1, stiffness: 150, damping: 12 });

  const itemClass = cn(
    "aspect-square rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200",
    isActive
      ? "bg-cyan-600 dark:bg-accent text-white"
      : "bg-slate-700 dark:bg-slate-600 text-white hover:bg-slate-900 dark:hover:bg-slate-500"
  );

  const content = (
    <motion.div ref={ref} style={{ width }} className={itemClass} title={label}>
      <motion.div
        style={{ scale: iconSpring }}
        className="flex items-center justify-center w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );

  if (external) {
    return (
      <a href={link} target={target || "_blank"} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link to={link}>{content}</Link>;
};
