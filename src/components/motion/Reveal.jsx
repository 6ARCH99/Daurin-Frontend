import { useEffect, useRef, useState } from 'react';

const Reveal = ({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
  once = true,
  threshold = 0.12,
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -48px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  const variantClass = variant === 'scale' ? 'reveal-scale' : 'reveal';

  return (
    <Tag
      ref={ref}
      className={`${variantClass} ${visible ? 'reveal--visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
