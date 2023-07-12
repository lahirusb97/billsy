import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
export default function AnimateRoute({ children }) {
  const animations = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition="transition"
    >
      {children}
    </motion.div>
  );
}
