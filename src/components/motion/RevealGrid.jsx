import { useEffect, useRef, useState } from 'react';

const RevealGrid = ({ children, className = '', threshold = 0.08 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`stagger-grid ${visible ? 'stagger-grid--visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default RevealGrid;
